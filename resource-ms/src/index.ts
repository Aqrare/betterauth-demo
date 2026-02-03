import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwtAuth } from './middleware/jwt.js'

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

// 簡易的なTodoストア（インメモリ）
interface Todo {
  id: string
  userId: string
  title: string
  completed: boolean
  createdAt: string
}

const todos: Todo[] = []

// 以下のエンドポイントはすべてJWT認証が必要
app.use('/api/*', jwtAuth())

// Todo一覧取得（自分のTodoのみ）
app.get('/api/todos', (c) => {
  const user = c.get('user') as any
  const userTodos = todos.filter(todo => todo.userId === user.sub || todo.userId === user.userId)

  return c.json({
    todos: userTodos,
    user: {
      id: user.sub || user.userId,
      email: user.email,
    }
  })
})

// Todo作成
app.post('/api/todos', async (c) => {
  const user = c.get('user') as any
  const body = await c.req.json()

  const newTodo: Todo = {
    id: crypto.randomUUID(),
    userId: user.sub || user.userId,
    title: body.title,
    completed: false,
    createdAt: new Date().toISOString(),
  }

  todos.push(newTodo)

  return c.json({ todo: newTodo }, 201)
})

// Todo更新
app.patch('/api/todos/:id', async (c) => {
  const user = c.get('user') as any
  const todoId = c.req.param('id')
  const body = await c.req.json()

  const todo = todos.find(t => t.id === todoId && t.userId === (user.sub || user.userId))

  if (!todo) {
    return c.json({ error: 'Todo not found' }, 404)
  }

  if (body.title !== undefined) todo.title = body.title
  if (body.completed !== undefined) todo.completed = body.completed

  return c.json({ todo })
})

// Todo削除
app.delete('/api/todos/:id', (c) => {
  const user = c.get('user') as any
  const todoId = c.req.param('id')

  const index = todos.findIndex(t => t.id === todoId && t.userId === (user.sub || user.userId))

  if (index === -1) {
    return c.json({ error: 'Todo not found' }, 404)
  }

  todos.splice(index, 1)

  return c.json({ message: 'Todo deleted' })
})

const port = Number(process.env.PORT) || 4001

export default {
  port,
  fetch: app.fetch,
}
