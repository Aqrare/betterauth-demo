import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth.js'
import apiKeyRoutes from './routes/apikey.routes.js'
import { AppError } from './lib/errors.js'
import { ZodError } from 'zod'

const app = new Hono()

// エラーハンドリングミドルウェア
app.onError((err, c) => {
  // カスタムエラー
  if (err instanceof AppError) {
    return c.json(
      {
        error: err.message,
        code: err.code,
      },
      err.statusCode
    )
  }

  // Zod バリデーションエラー
  if (err instanceof ZodError) {
    return c.json(
      {
        error: 'Validation Error',
        code: 'VALIDATION_ERROR',
        details: err.errors,
      },
      400
    )
  }

  // 予期しないエラー
  console.error('Unexpected error:', err)
  return c.json(
    {
      error: 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR',
    },
    500
  )
})

app.use('/*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.get('/', (c) => {
  return c.json({ message: 'Auth Demo API' })
})

app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// BetterAuth endpoints
app.on(['POST', 'GET'], '/api/auth/**', (c) => {
  return auth.handler(c.req.raw)
})

// API Key routes
app.route('/api/apikey', apiKeyRoutes)

// Custom API: Get user accounts
app.get('/api/user/accounts', async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers
  })

  if (!session) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED')
  }

  // データベースからアカウント情報を取得
  const { Pool } = await import('pg')
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  })

  const result = await pool.query(
    'SELECT "providerId" FROM account WHERE "userId" = $1',
    [session.user.id]
  )

  await pool.end()

  const accounts = result.rows.map(row => ({
    providerId: row.providerId
  }))

  return c.json({ accounts })
})

const port = Number(process.env.PORT) || 3000

export default {
  port,
  fetch: app.fetch,
}
