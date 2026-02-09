import { Hono } from 'hono'
import type { Context } from 'hono'
import { cors } from 'hono/cors'
import { jwtAuth } from './middleware/jwt.js'
import { requireAdmin } from './middleware/admin.js'
import { apiKeyAuth } from './middleware/apikey.js'
import { requirePermissions, requireAllPermissions } from './middleware/permission.js'

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

app.get('/api/apikey/test', apiKeyAuth(), (c: Context) => {
  const userId = c.get('userId') as string
  const organizationId = c.get('organizationId') as string | null
  const permissions = c.get('permissions') as string[]

  return c.json({
    success: true,
    message: 'API Key認証成功！',
    auth: {
      method: 'apikey',
      userId,
      organizationId,
      permissions,
    },
    timestamp: new Date().toISOString(),
  })
})

// read:resourcesのpermissionが必要
app.get('/api/apikey/resources', apiKeyAuth(), requirePermissions('read:resources'), (c: Context) => {
  const userId = c.get('userId') as string
  const permissions = c.get('permissions') as string[]

  return c.json({
    success: true,
    message: 'リソース取得成功！',
    data: {
      resources: [
        { id: '1', name: 'Resource A', type: 'document' },
        { id: '2', name: 'Resource B', type: 'image' },
        { id: '3', name: 'Resource C', type: 'video' },
      ],
    },
    auth: {
      userId,
      permissions,
    },
    timestamp: new Date().toISOString(),
  })
})

// write:resourcesのpermissionが必要
app.post('/api/apikey/resources', apiKeyAuth(), requirePermissions('write:resources'), async (c: Context) => {
  const userId = c.get('userId') as string
  const permissions = c.get('permissions') as string[]
  const body = await c.req.json()

  return c.json({
    success: true,
    message: 'リソース作成成功！',
    data: {
      resource: {
        id: Math.random().toString(36).substring(7),
        name: body.name || 'New Resource',
        type: body.type || 'document',
        createdBy: userId,
      },
    },
    auth: {
      userId,
      permissions,
    },
    timestamp: new Date().toISOString(),
  })
})

// admin:resourcesのpermissionが必要
app.delete('/api/apikey/resources/:id', apiKeyAuth(), requirePermissions('admin:resources'), (c: Context) => {
  const userId = c.get('userId') as string
  const permissions = c.get('permissions') as string[]
  const resourceId = c.req.param('id')

  return c.json({
    success: true,
    message: 'リソース削除成功！',
    data: {
      deletedResourceId: resourceId,
      deletedBy: userId,
    },
    auth: {
      userId,
      permissions,
    },
    timestamp: new Date().toISOString(),
  })
})

// 複数のpermissionsが必要（AND条件）
app.patch('/api/apikey/resources/:id', apiKeyAuth(), requireAllPermissions('read:resources', 'write:resources'), async (c: Context) => {
  const userId = c.get('userId') as string
  const permissions = c.get('permissions') as string[]
  const resourceId = c.req.param('id')
  const body = await c.req.json()

  return c.json({
    success: true,
    message: 'リソース更新成功！',
    data: {
      resource: {
        id: resourceId,
        name: body.name || 'Updated Resource',
        updatedBy: userId,
      },
    },
    auth: {
      userId,
      permissions,
    },
    timestamp: new Date().toISOString(),
  })
})

// ===== JWT認証エンドポイント =====

// JWT認証が必要なエンドポイント（/api/apikey/*以外）
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
