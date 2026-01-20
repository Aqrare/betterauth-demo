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

const port = Number(process.env.PORT) || 3000

serve({
  fetch: app.fetch,
  port
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
