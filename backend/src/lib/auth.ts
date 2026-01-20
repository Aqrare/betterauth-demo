import { betterAuth } from "better-auth"
import { db } from "../db/index.js"

export const auth = betterAuth({
  // 既存のKyselyインスタンスを使用
  database: db,

  // Email & Passwordプロバイダーを有効化
  emailAndPassword: {
    enabled: true,
  },

  // アプリケーションの基本設定
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
})
