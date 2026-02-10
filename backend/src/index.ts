import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth.js'
import { errorHandler } from './middlewares/error-handler.js'
import apiKeyRoutes from './routes/apikey.routes.js'
import userRoutes from './routes/user.routes.js'

const app = new Hono()

// ミドルウェア
app.onError(errorHandler)
app.use('/*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

// ヘルスチェック
app.get('/', (c) => c.json({ message: 'Auth Demo API' }))
app.get('/health', (c) => c.json({ status: 'ok' }))

// 認証エンドポイント
app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw))

// APIルート
app.route('/api/apikey', apiKeyRoutes)
app.route('/api/user', userRoutes)

const port = Number(process.env.PORT) || 3000

export default {
  port,
  fetch: app.fetch,
}
