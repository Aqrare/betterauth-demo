import type { Context, Next } from "hono"
import { createRemoteJWKSet, jwtVerify } from "jose"
import type { GlobalRole, JWTPayload, OrganizationRole } from "../lib/types.js"

const AUTH_MS_URL = process.env.AUTH_MS_URL || ""
const JWKS_URL = `${AUTH_MS_URL}/api/auth/jwks`

// JWKSを取得してキャッシュ
const JWKS = createRemoteJWKSet(new URL(JWKS_URL))

/**
 * JWT認証ミドルウェア
 * JWT署名を検証し、ユーザー情報をコンテキストに格納
 */
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized: No token provided" }, 401)
  }

  const token = authHeader.substring(7)

  try {
    // JWT署名検証
    const { payload } = await jwtVerify(token, JWKS)

    // JWTペイロードをユーザー情報として格納
    const user: JWTPayload = {
      sub: payload.sub as string,
      role: payload.role as GlobalRole,
      twoFactorEnabled: payload.twoFactorEnabled as boolean,
      serviceId: (payload.serviceId as string | null) ?? null,
      organizationRole:
        (payload.organizationRole as OrganizationRole | null) ?? null,
      exp: payload.exp,
      iat: payload.iat,
    };

    c.set("user", user)

    await next()
  } catch (error) {
    return c.json({ error: "Unauthorized: Invalid token" }, 401)
  }
}
