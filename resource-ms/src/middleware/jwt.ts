import { createMiddleware } from 'hono/factory'
import { jwtVerify } from 'jose'

// JWT検証ミドルウェア
export const jwtAuth = () => {
  return createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401)
    }

    const token = authHeader.substring(7) // "Bearer " を除去

    try {
      // JWTを検証（Auth MSのシークレットを使用）
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET)
      const { payload } = await jwtVerify(token, secret)

      // ユーザー情報をコンテキストに保存
      c.set('user', payload)

      await next()
    } catch (error) {
      console.error('JWT verification failed:', error)
      return c.json({ error: 'Unauthorized: Invalid token' }, 401)
    }
  })
}
