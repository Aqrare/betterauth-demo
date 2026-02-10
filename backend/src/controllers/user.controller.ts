import type { Context } from 'hono'
import { auth } from '../lib/auth.js'
import { userService } from '../services/user.service.js'
import { UnauthorizedError } from '../lib/errors.js'

export class UserController {
  async getAccounts(c: Context) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session) throw new UnauthorizedError()

    const accounts = await userService.getAccounts(session.user.id)
    return c.json({ accounts })
  }
}

export const userController = new UserController()
