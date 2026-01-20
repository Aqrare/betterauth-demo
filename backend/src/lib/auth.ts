import { betterAuth } from "better-auth"
import { Pool } from "pg"
import dotenv from "dotenv"
import { sendVerificationEmail, sendPasswordResetEmail } from "./email.js"
import { twoFactor } from "better-auth/plugins";

// 環境変数を確実に読み込む
dotenv.config()

export const auth = betterAuth({
  appName: "Auth Demo App",
  plugins: [twoFactor()],

  // データベース接続設定
  database: new Pool({
    connectionString: process.env.DATABASE_URL!,
  }),

  // Email & Passwordプロバイダーを有効化
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // メール認証を必須に
    sendResetPassword: async ({ user, url, token }) => {
      // タイミング攻撃を防ぐためawaitしない
      void sendPasswordResetEmail({
        to: user.email,
        url,
        userName: user.name,
      })
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`)
    },
  },

  // メール認証設定
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      // 認証完了後のリダイレクト先をURLに追加
      const urlWithCallback = new URL(url)
      urlWithCallback.searchParams.set(
        'callbackURL',
        `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`
      )

      // タイミング攻撃を防ぐためawaitしない
      void sendVerificationEmail({
        to: user.email,
        url: urlWithCallback.toString(),
        userName: user.name,
      })
    },
    sendOnSignUp: true, // サインアップ時に自動送信
    autoSignInAfterVerification: true, // 認証後自動ログイン
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
