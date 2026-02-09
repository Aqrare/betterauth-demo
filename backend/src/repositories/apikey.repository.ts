import { db } from '../db/index.js'

export class ApiKeyRepository {
  async setOrganizationId(keyId: string, organizationId: string | null) {
    return db
      .updateTable('apikey')
      .set({ organizationId })
      .where('id', '=', keyId)
      .returningAll()
      .executeTakeFirst()
  }

  async findByOrganizationId(organizationId: string) {
    return db
      .selectFrom('apikey')
      .selectAll()
      .where('organizationId', '=', organizationId)
      .orderBy('createdAt', 'desc')
      .execute()
  }

  async findByUserId(userId: string) {
    return db
      .selectFrom('apikey')
      .selectAll()
      .where('userId', '=', userId)
      .where('organizationId', 'is', null)
      .orderBy('createdAt', 'desc')
      .execute()
  }

  async delete(keyId: string) {
    return db
      .deleteFrom('apikey')
      .where('id', '=', keyId)
      .execute()
  }

  async findByPrefix(prefix: string) {
    return db
      .selectFrom('apikey')
      .selectAll()
      .where('prefix', '=', prefix)
      .executeTakeFirst()
  }
}

export const apiKeyRepository = new ApiKeyRepository()
