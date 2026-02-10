import { auth } from '../lib/auth.js'
import { apiKeyRepository } from '../repositories/apikey.repository.js'
import type { CreateApiKeyRequest } from '../dtos/apikey.dto.js'

export class ApiKeyService {
  async create(userId: string, organizationId: string | null, params: CreateApiKeyRequest) {
    const permissionsObj: Record<string, string[]> = (params.permissions ?? []).reduce(
      (acc, perm) => {
        const [action, resource] = perm.split(':')
        if (!resource) return acc

        return {
          ...acc,
          [resource]: [...(acc[resource] ?? []), action],
        }
      },
      {} as Record<string, string[]>
    )

    const result = await auth.api.createApiKey({
      body: {
        name: params.name,
        expiresIn: params.expiresIn,
        userId,
        permissions: Object.keys(permissionsObj).length > 0 ? permissionsObj : undefined,
      },
    })

    if (!result || !result.id) throw new Error('Failed to create API key')

    const updatedKey = await apiKeyRepository.setOrganizationId(result.id, organizationId)

    return {
      ...updatedKey,
      key: result.key,
    }
  }

  async list(userId: string, organizationId: string | null) {
    if (organizationId) return apiKeyRepository.findByOrganizationId(organizationId)
    return apiKeyRepository.findByUserId(userId)
  }

  async delete(keyId: string) {
    return apiKeyRepository.delete(keyId)
  }

  async verify(apiKey: string) {
    try {
      const result = await auth.api.verifyApiKey({
        body: {
          key: apiKey,
        },
      })

      if (!result.valid || !result.key) {
        return {
          valid: false,
          error: result.error?.message || 'Invalid or expired API key'
        }
      }

      const apiKeyData = result.key

      const permissions: string[] = (() => {
        if (!apiKeyData.permissions) return []

        try {
          const permsObj = typeof apiKeyData.permissions === 'string'
            ? JSON.parse(apiKeyData.permissions)
            : apiKeyData.permissions

          if (Array.isArray(permsObj)) return permsObj

          if (typeof permsObj === 'object') {
            return Object.entries(permsObj).flatMap(([resource, actions]) =>
              Array.isArray(actions)
                ? actions.map(action => `${action}:${resource}`)
                : []
            )
          }

          return []
        } catch {
          return []
        }
      })()

      const keyDetails = apiKeyData.prefix
        ? await apiKeyRepository.findByPrefix(apiKeyData.prefix)
        : null

      return {
        valid: true,
        userId: apiKeyData.userId,
        organizationId: keyDetails?.organizationId || null,
        permissions,
      }
    } catch (error) {
      console.error('Error verifying API key:', error)
      return {
        valid: false,
        error: 'Internal server error'
      }
    }
  }
}

export const apiKeyService = new ApiKeyService()
