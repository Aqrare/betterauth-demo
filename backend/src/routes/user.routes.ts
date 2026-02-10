import { Hono } from 'hono'
import { userController } from '../controllers/user.controller.js'

const app = new Hono()

app.get('/accounts', (c) => userController.getAccounts(c))

export default app
