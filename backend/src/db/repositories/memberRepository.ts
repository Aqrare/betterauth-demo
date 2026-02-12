import { db } from '../index.js'

export class MemberRepository {
  async getOrganizationRole(
    userId: string,
    organizationId: string
  ): Promise<string | null> {
    try {
      const result = await db
        .selectFrom('member')
        .select('role')
        .where('user_id', '=', userId)
        .where('service_id', '=', organizationId)
        .executeTakeFirst()

      return result?.role ?? null
    } catch (error) {
      console.error('Error fetching organization role:', error)
      return null
    }
  }
}

export const memberRepository = new MemberRepository()
