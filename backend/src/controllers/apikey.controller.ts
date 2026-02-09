import type { Context } from 'hono'
import { auth } from '../lib/auth.js'
import { apiKeyService } from '../services/apikey.service.js'
import type { CreateApiKeyRequest } from '../dtos/apikey.dto.js'
import type { VerifyApiKeyRequest } from '../dtos/verify-apikey.dto.js'

export class ApiKeyController {
  async create(c: Context) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json() as CreateApiKeyRequest
    const activeOrganizationId = session.session.activeOrganizationId

    try {
      const apiKey = await apiKeyService.create(
        session.user.id,
        activeOrganizationId || null,
        body
      )

      return c.json({ data: apiKey })
    } catch (error) {
      console.error('Error creating API key:', error)
      return c.json({ error: 'Failed to create API key' }, 500)
    }
  }

  async list(c: Context) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const activeOrganizationId = session.session.activeOrganizationId

    try {
      const apiKeys = await apiKeyService.list(
        session.user.id,
        activeOrganizationId || null
      )

      return c.json({ data: apiKeys })
    } catch (error) {
      console.error('Error listing API keys:', error)
      return c.json({ error: 'Failed to list API keys' }, 500)
    }
  }

  async delete(c: Context) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { id } = c.req.param()

    try {
      await apiKeyService.delete(id)
      return c.json({ success: true })
    } catch (error) {
      console.error('Error deleting API key:', error)
      return c.json({ error: 'Failed to delete API key' }, 500)
    }
  }

  /**
   * API Keyを検証してpermissionsを返す
   * Resource MSから呼び出される
   */
  async verify(c: Context) {
    try {
      const body = await c.req.json() as VerifyApiKeyRequest

      if (!body.apiKey) {
        return c.json({
          error: 'Bad Request',
          message: 'API Key is required'
        }, 400)
      }

      const result = await apiKeyService.verify(body.apiKey)

      if (!result.valid) {
        return c.json({
          error: 'Unauthorized',
          message: result.error || 'Invalid API key'
        }, 401)
      }

      return c.json({
        data: {
          valid: result.valid,
          userId: result.userId!,
          organizationId: result.organizationId!,
          permissions: result.permissions!,
        }
      })
    } catch (error) {
      console.error('Error verifying API key:', error)
      return c.json({
        error: 'Internal Server Error',
        message: String(error)
      }, 500)
    }
  }
}

export const apiKeyController = new ApiKeyController()
