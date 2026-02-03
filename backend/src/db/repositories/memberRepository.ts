import { db } from '../index.js'

/**
 * Member Repository
 * 組織メンバー情報のデータアクセス層
 */
export class MemberRepository {
  /**
   * ユーザーの組織内でのロールを取得
   * @param userId ユーザーID
   * @param organizationId 組織ID
   * @returns ロール (owner | admin | member) または null
   */
  async getOrganizationRole(
    userId: string,
    organizationId: string
  ): Promise<string | null> {
    try {
      const result = await db
        .selectFrom('member')
        .select('role')
        .where('userId', '=', userId)
        .where('organizationId', '=', organizationId)
        .executeTakeFirst()

      return result?.role ?? null
    } catch (error) {
      console.error('Error fetching organization role:', error)
      return null
    }
  }
}

// シングルトンインスタンスをエクスポート
export const memberRepository = new MemberRepository()
