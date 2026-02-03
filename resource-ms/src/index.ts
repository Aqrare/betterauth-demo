import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwtAuth } from './middleware/jwt.js'
import { requireAdmin } from './middleware/admin.js'

const app = new Hono()

// CORS設定
app.use('/*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

// ヘルスチェック（認証不要）
app.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'resource-ms' })
})

// JWT認証が必要なエンドポイント
app.use('/api/*', jwtAuth())

// 一般ユーザーでもアクセス可能なテストエンドポイント
app.get('/api/test', (c) => {
  const user = c.get('user') as any

  return c.json({
    success: true,
    message: 'JWT認証成功！',
    user: {
      id: user.sub,
      email: user.email,
      role: user.role || 'user',
    },
    timestamp: new Date().toISOString(),
  })
})

// 管理者専用エンドポイント（admin権限が必要）
app.get('/api/admin/test', requireAdmin(), (c) => {
  const user = c.get('user') as any

  return c.json({
    success: true,
    message: '管理者権限確認成功！',
    user: {
      id: user.sub,
      email: user.email,
      role: user.role,
    },
    adminFeatures: [
      'ユーザー管理',
      'システム設定',
      '統計データ閲覧',
    ],
    timestamp: new Date().toISOString(),
  })
})

const port = Number(process.env.PORT) || 4001

export default {
  port,
  fetch: app.fetch,
}
