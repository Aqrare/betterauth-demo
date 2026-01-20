# BetterAuth Demo

BetterAuthを使用したシンプルな認証システムのデモアプリケーションです。フロントエンドとバックエンドを分離したSPA構成で、メール・パスワード認証を実装しています。

## 技術スタック

### Backend
- **Hono** - 軽量なNode.js Webフレームワーク
- **BetterAuth** - TypeScript向け認証ライブラリ
- **PostgreSQL** - データベース
- **Kysely** - 型安全なSQLクエリビルダー
- **TypeScript** - 型安全な開発環境

### Frontend
- **React 19** - UIライブラリ
- **Vite** - ビルドツール
- **TailwindCSS v4** - ユーティリティファーストCSSフレームワーク
- **React Router v7** - クライアントサイドルーティング
- **BetterAuth React Client** - 認証クライアント
- **Biome** - リンター・フォーマッター

## プロジェクト構造

```
auth-demo/
├── backend/              # バックエンド（Hono API）
│   ├── src/
│   │   ├── index.ts     # Honoサーバーのエントリーポイント
│   │   └── lib/
│   │       └── auth.ts  # BetterAuthインスタンス設定
│   ├── .env             # 環境変数
│   └── package.json
├── frontend/             # フロントエンド（React + Vite）
│   ├── src/
│   │   ├── main.tsx     # Reactアプリのエントリーポイント
│   │   ├── lib/
│   │   │   └── auth.ts  # BetterAuthクライアント設定
│   │   └── pages/
│   │       ├── Home.tsx      # ホームページ
│   │       ├── Login.tsx     # ログインページ
│   │       ├── Signup.tsx    # サインアップページ
│   │       └── Dashboard.tsx # ダッシュボード（認証保護）
│   └── package.json
└── docker-compose.yml    # PostgreSQLコンテナ設定
```

## 必要な環境

- **Node.js** 18以上
- **pnpm** パッケージマネージャー
- **Docker & Docker Compose** (PostgreSQL用)

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd auth-demo
```

### 2. PostgreSQLの起動

```bash
docker compose up -d
```

PostgreSQLは `localhost:5433` で起動します。

### 3. バックエンドのセットアップ

```bash
cd backend
pnpm install
```

#### 環境変数の設定

`backend/.env` ファイルを作成:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/auth_demo
PORT=3000
BETTER_AUTH_SECRET=your-secret-key-min-32-chars-long-please-change-this-in-production
BETTER_AUTH_URL=http://localhost:3000
```

#### データベースマイグレーションの実行

```bash
pnpm dlx @better-auth/cli@latest migrate
```

これにより、`user`, `session`, `account`, `verification` テーブルが自動生成されます。

### 4. フロントエンドのセットアップ

```bash
cd ../frontend
pnpm install
```

## アプリケーションの起動

### バックエンドの起動

```bash
cd backend
pnpm dev
```

バックエンドは `http://localhost:3000` で起動します。

### フロントエンドの起動

別のターミナルで:

```bash
cd frontend
pnpm dev
```

フロントエンドは `http://localhost:5173` で起動します。

## 認証フロー

### 1. サインアップ
1. `http://localhost:5173` にアクセス
2. "Sign Up" をクリック
3. 名前、メールアドレス、パスワード（8文字以上）を入力
4. "Sign Up" ボタンをクリック
5. 成功するとダッシュボードにリダイレクトされます

### 2. ログイン
1. "Login" ページに移動
2. メールアドレスとパスワードを入力
3. "Remember me" チェックボックス（オプション）
4. "Login" ボタンをクリック
5. 成功するとダッシュボードにリダイレクトされます

### 3. ダッシュボード
- 認証されたユーザーの情報（名前、メールアドレス）を表示
- "Sign Out" ボタンでログアウト

### 4. セッション管理
- ダッシュボードは認証が必要な保護されたページです
- セッションがない場合、自動的にログインページにリダイレクトされます
- "Remember me" を有効にすると、セッションの有効期限が延長されます

## 主要な実装ポイント

### バックエンド

**`backend/src/lib/auth.ts`**
```typescript
import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL!,
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  trustedOrigins: ["http://localhost:5173"],
})
```

**`backend/src/index.ts`**
```typescript
// BetterAuthハンドラーをHonoに統合
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  return auth.handler(c.req.raw)
})
```

### フロントエンド

**`frontend/src/lib/auth.ts`**
```typescript
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
})
```

**認証処理の実装パターン**
```typescript
// サインアップ/ログインの例
await authClient.signUp.email(
  { email, password, name, callbackURL: "/dashboard" },
  {
    onRequest: () => { /* ローディング状態 */ },
    onSuccess: () => { /* 成功時の処理 */ },
    onError: (ctx) => { /* エラーハンドリング */ },
  }
)

// セッション管理の例
const { data: session, isPending, error } = authClient.useSession()
```

## トラブルシューティング

### PostgreSQLへの接続エラー
- `docker compose ps` でPostgreSQLコンテナが起動しているか確認
- ポート5433が使用可能か確認
- `.env` の `DATABASE_URL` が正しいか確認

### CORSエラー
- `backend/src/lib/auth.ts` の `trustedOrigins` にフロントエンドのURLが含まれているか確認
- バックエンドとフロントエンドが正しいポートで起動しているか確認

### マイグレーションエラー
- PostgreSQLが起動していることを確認
- `DATABASE_URL` が正しく設定されているか確認
- マイグレーションコマンドを `backend` ディレクトリから実行しているか確認

### サインアップ/ログインエラー
- ブラウザのコンソールでエラーメッセージを確認
- バックエンドが `http://localhost:3000` で起動しているか確認
- ネットワークタブでAPIリクエストが `/api/auth/*` に正しく送信されているか確認

## 開発コマンド

### バックエンド
```bash
pnpm dev      # 開発サーバー起動（ホットリロード）
pnpm build    # TypeScriptビルド
pnpm start    # プロダクションサーバー起動
```

### フロントエンド
```bash
pnpm dev      # 開発サーバー起動（ホットリロード）
pnpm build    # プロダクションビルド
pnpm preview  # ビルド結果のプレビュー
pnpm lint     # Biomeリント
pnpm format   # Biomeフォーマット
```

## データベーススキーマ

BetterAuthが自動生成するテーブル:

- **user** - ユーザー情報（id, name, email, emailVerified, createdAt, updatedAt）
- **session** - セッション情報（id, userId, expiresAt, token, ipAddress, userAgent）
- **account** - アカウント情報（OAuth連携用）
- **verification** - メール認証用（今回は未使用）

## 今後の拡張案

- メール認証の実装
- OAuth認証（Google, GitHub等）の追加
- プロフィール編集機能
- パスワードリセット機能
- セッション管理UI
- BetterAuthプラグインの活用

## ライセンス

MIT
