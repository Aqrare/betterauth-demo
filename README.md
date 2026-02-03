# BetterAuth Demo

BetterAuthを使用したシンプルな認証システムのデモアプリケーションです。フロントエンドとバックエンドを分離したSPA構成で、メール・パスワード認証を実装しています。

## 技術スタック

### Backend
- Bun
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

### 2. 環境変数の設定

#### バックエンドの環境変数

```bash
cd backend
cp .env.example .env
```

`.env` ファイルを編集して以下の値を設定してください:

1. **BETTER_AUTH_SECRET**:
   - 最低32文字のランダムな文字列を生成
   - 生成方法: `openssl rand -base64 32`

2. **GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET**:
   - [Google Cloud Console](https://console.cloud.google.com/) で取得

3. **RESEND_API_KEY**:
   - [Resend](https://resend.com/) で取得（メール送信機能に必要）


#### フロントエンドの環境変数

```bash
cd ../frontend
cp .env.example .env
```

`.env` ファイルを編集して **VITE_GOOGLE_CLIENT_ID** を設定してください（バックエンドと同じGoogle Client IDを使用）。

### 3. データベースマイグレーション

Docker Composeでサービスを起動した後、バックエンドコンテナ内でマイグレーションを実行します。

```bash
# プロジェクトルートで実行
docker compose up -d

# マイグレーション実行
docker compose exec backend bunx @better-auth/cli@latest migrate
```

これにより、`user`, `session`, `account`, `verification`, `twoFactor`, `passkey` テーブルが自動生成されます。

## アプリケーションの起動

すべてのサービス（PostgreSQL、バックエンド、フロントエンド）をDocker Composeで起動します。

```bash
# プロジェクトルートで実行
docker compose up -d
```

### アクセスURL

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:3000
- PostgreSQL: localhost:5433

## データベーススキーマ

BetterAuthが自動生成するテーブル:

- **user** - ユーザー情報
- **session** - セッション情報
- **account** - OAuth連携用
- **verification** - メール認証用
- **twoFactor** - 2要素認証用
- **passkey** - パスキー用
