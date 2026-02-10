import type { Context } from 'hono'
import { auth } from '../lib/auth.js'
import { apiKeyService } from '../services/apikey.service.js'
import type { CreateApiKeyRequest } from '../dtos/apikey.dto.js'
import type { VerifyApiKeyRequest } from '../dtos/verify-apikey.dto.js'
import { UnauthorizedError } from '../lib/errors.js'

export class ApiKeyController {
  async create(c: Context) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session) throw new UnauthorizedError()

    const body = await c.req.json<CreateApiKeyRequest>()
    const activeOrganizationId = session.session.activeOrganizationId

    const apiKey = await apiKeyService.create(
      session.user.id,
      activeOrganizationId ?? null,
      body
    )

    return c.json({ data: apiKey })
  }

  async list(c: Context) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session) throw new UnauthorizedError()

    const activeOrganizationId = session.session.activeOrganizationId

    const apiKeys = await apiKeyService.list(
      session.user.id,
      activeOrganizationId ?? null
    )

    return c.json({ data: apiKeys })
  }

  async delete(c: Context) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session) throw new UnauthorizedError()

    const { id } = c.req.param()

    await apiKeyService.delete(id)
    return c.json({ success: true })
  }

  /**
   * API Keyを検証してpermissionsを返す
   * Resource MSから呼び出される
   */
  async verify(c: Context) {
    const body = await c.req.json<VerifyApiKeyRequest>()

    const result = await apiKeyService.verify(body.apiKey)

    if (!result.valid) throw new UnauthorizedError(result.error ?? 'Invalid API key')

    return c.json({
      data: {
        valid: result.valid,
        userId: result.userId!,
        organizationId: result.organizationId!,
        permissions: result.permissions!,
      }
    })
  }
}

export const apiKeyController = new ApiKeyController()
