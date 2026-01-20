import { betterAuth } from "better-auth"
import { Pool } from "pg"
import dotenv from "dotenv"

// 環境変数を確実に読み込む
dotenv.config()

export const auth = betterAuth({
  // データベース接続設定
  database: new Pool({
    connectionString: process.env.DATABASE_URL!,
  }),

  // Email & Passwordプロバイダーを有効化
  emailAndPassword: {
    enabled: true,
  },

  // アプリケーションの基本設定
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,

  // フロントエンドからのアクセスを許可
  trustedOrigins: ["http://localhost:5173"],
})
