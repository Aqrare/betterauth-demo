import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import dotenv from 'dotenv'
import { auth } from './lib/auth.js'

dotenv.config()

const app = new Hono()

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

// Custom API: Get user accounts
app.get('/api/user/accounts', async (c) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers
    })

    if (!session) {
      return c.json({ error: 'Unauthorized' }, 401)
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
  } catch (error) {
    console.error('Error fetching user accounts:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

const port = Number(process.env.PORT) || 3000

serve({
  fetch: app.fetch,
  port
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
