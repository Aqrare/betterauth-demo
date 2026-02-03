import { createMiddleware } from 'hono/factory'
import { jwtVerify, createRemoteJWKSet } from 'jose'

// Auth MSのベースURL（環境変数から取得、デフォルトはlocalhost）
const AUTH_MS_BASE_URL = process.env.AUTH_MS_URL || 'http://backend:3000'

// JWKSエンドポイントからリモートJWKセットを作成
const JWKS = createRemoteJWKSet(
  new URL(`${AUTH_MS_BASE_URL}/api/auth/jwks`)
)

/**
 * JWT検証ミドルウェア
 * BetterAuthが発行したJWTをJWKS（公開鍵）で検証
 */
export const jwtAuth = () => {
  return createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        error: 'Unauthorized: Missing or invalid Authorization header',
        message: 'Please provide a valid Bearer token'
      }, 401)
    }

    const token = authHeader.substring(7) // "Bearer " を除去

    try {
      // JWTを検証（Auth MSのJWKSから公開鍵を取得して検証）
      // issuerとaudienceの検証は行わない（署名検証のみ）
      // ※ Auth MSは http://localhost:3000 を使用するが、Resource MSはDocker内で http://backend:3000 を使用するため
      const { payload } = await jwtVerify(token, JWKS)

      // ユーザー情報をコンテキストに保存
      c.set('user', payload)

      console.log('JWT verified successfully:', {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
        iss: payload.iss,
        aud: payload.aud,
      })

      await next()
    } catch (error) {
      console.error('JWT verification failed:', error)

      // エラーの詳細をログに出力（開発環境のみ）
      if (process.env.NODE_ENV !== 'production') {
        console.error('Token:', token.substring(0, 20) + '...')
        console.error('Error details:', error)
      }

      return c.json({
        error: 'Unauthorized: Invalid or expired token',
        message: error instanceof Error ? error.message : 'Token verification failed'
      }, 401)
    }
  })
}
