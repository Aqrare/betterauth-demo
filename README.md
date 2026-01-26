# BetterAuth Demo

BetterAuthを使用したシンプルな認証システムのデモアプリケーションです。フロントエンドとバックエンドを分離したSPA構成で、メール・パスワード認証を実装しています。

## 技術スタック

### Backend
- Hono
- BetterAuth
- PostgreSQL
- Kysely
- TypeScript

### Frontend
- React 19
- Vite
- TailwindCSS v4
- React Router v7
- BetterAuth React Client
- Biome

## プロジェクト構造

```
auth-demo/
├── backend/
│   ├── src/
│   │   ├── index.ts        # Honoサーバー
│   │   └── lib/auth.ts     # BetterAuth設定
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── lib/auth.ts     # BetterAuthクライアント
│   │   └── pages/          # Login, Signup, Dashboard等
│   └── .env
└── docker-compose.yml
```


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

`.env.example` をコピーして `.env` ファイルを作成:

```bash
cp .env.example .env
```

次に、`.env` ファイルを編集して以下の値を設定してください:

1. **BETTER_AUTH_SECRET**:
   - 最低32文字のランダムな文字列を生成してください
   - 生成方法: `openssl rand -base64 32`

2. **GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET**:
   - [Google Cloud Console](https://console.cloud.google.com/) で取得

3. **RESEND_API_KEY**:
   - [Resend](https://resend.com/) で取得（メール送信機能に必要）

⚠️ **セキュリティ警告**:
- `.env` ファイルは絶対にGitにコミットしないでください
- 実際の認証情報を共有する場合は、安全な方法（1Password、環境変数管理サービス等）を使用してください

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

#### 環境変数の設定

`.env.example` をコピーして `.env` ファイルを作成:

```bash
cp .env.example .env
```

次に、`.env` ファイルを編集して **VITE_GOOGLE_CLIENT_ID** を設定してください（バックエンドと同じGoogle Client IDを使用）。

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



## データベーススキーマ

BetterAuthが自動生成するテーブル:

- **user** - ユーザー情報
- **session** - セッション情報
- **account** - OAuth連携用
- **verification** - メール認証用
- **twoFactor** - 2要素認証用
- **passkey** - パスキー用


