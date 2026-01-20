import { betterAuth } from "better-auth"
import { Pool } from "pg";

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
})
