import { createMiddleware } from 'hono/factory'

/**
 * 管理者権限チェックミドルウェア
 * jwtAuth()の後に使用すること
 */
export const requireAdmin = () => {
  return createMiddleware(async (c, next) => {
    const user = c.get('user') as any
    console.log(user)

    if (!user) {
      return c.json({
        error: 'Unauthorized',
        message: 'ユーザー情報が見つかりません'
      }, 401)
    }

    // roleがadminでない場合は403エラー
    if (user.role !== 'admin') {
      return c.json({
        error: 'Forbidden',
        message: '管理者権限が必要です。現在のロール: ' + (user.role || 'user')
      }, 403)
    }

    console.log('Admin access granted:', user.email)
    await next()
  })
}
