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

  // ソーシャルログインプロバイダー
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account", // 毎回アカウント選択を表示
    },
  },

  // アカウントリンク設定（自動リンク有効）
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"], // Googleはメール確認済みなので信頼できる
    },
  },

  // アプリケーションの基本設定
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,

  // フロントエンドからのアクセスを許可
  trustedOrigins: ["http://localhost:5173"],
})
