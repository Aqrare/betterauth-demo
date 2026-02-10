import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { PostgresDialect } from "kysely";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email.js";
import { twoFactor } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { jwt } from "better-auth/plugins";
import { admin } from "better-auth/plugins";
import { organization } from "better-auth/plugins";
import { apiKey } from "better-auth/plugins";
import { memberRepository } from "../db/repositories/memberRepository.js";
import {
  userSchema,
  sessionSchema,
  accountSchema,
  verificationSchema,
  adminSchema,
  twoFactorSchema,
  jwtSchema,
  passkeySchema,
  organizationSchema,
  apiKeySchema,
} from "./auth-schemas.js";

export const auth = betterAuth({
  appName: "Auth Demo App",

  user: userSchema,
  session: sessionSchema,
  account: accountSchema,
  verification: verificationSchema,

  plugins: [
    twoFactor(twoFactorSchema),
    passkey(passkeySchema),
    admin(adminSchema),
    organization(organizationSchema),
    apiKey({
      defaultPrefix: "demo_",
      permissions: {
        defaultPermissions: {
          files: ["read"],
          users: ["read"],
        },
      },
      ...apiKeySchema,
    }),
    jwt({
      ...jwtSchema,
      jwt: {
        definePayload: async ({ user, session }) => {
          let organizationId = null;
          let organizationRole = null;

          const activeOrganizationId = session?.activeOrganizationId;

          if (activeOrganizationId) {
            organizationId = activeOrganizationId;
            organizationRole = await memberRepository.getOrganizationRole(
              user.id,
              activeOrganizationId,
            );
          }

          return {
            sub: user.id,
            role: user.role || "user",
            twoFactorEnabled: user.twoFactorEnabled || false,
            organizationId,
            organizationRole,
          };
        },
      },
    }),
  ],

  // データベース接続設定
  database: {
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL!,
      }),
    }),
    type: "postgres",
    casing: "snake",
  },
  advanced: {
    database: {
      generateId: (options) => {
        return crypto.randomUUID();
      },
    },
  },

  // Email & Passwordプロバイダーを有効化
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      void sendPasswordResetEmail({
        to: user.email,
        url,
        userName: user.name,
      });
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },

  // メール認証設定
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      // 認証完了後のリダイレクト先をURLに追加
      const urlWithCallback = new URL(url);
      urlWithCallback.searchParams.set(
        "callbackURL",
        `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard`,
      );

      void sendVerificationEmail({
        to: user.email,
        url: urlWithCallback.toString(),
        userName: user.name,
      });
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

  // アプリケーションの基本設定
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,

  // フロントエンドからのアクセスを許可
  trustedOrigins: ["http://localhost:5173"],
});
