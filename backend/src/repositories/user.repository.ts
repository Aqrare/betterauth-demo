import { db } from '../db/index.js'

/**
 * User Repository
 * ユーザー情報のデータアクセス層
 */
export class UserRepository {
  /**
   * ユーザーに紐づくアカウント（OAuth連携）のプロバイダーIDを取得
   * @param userId ユーザーID
   * @returns プロバイダーID配列
   */
  async getAccountProviders(userId: string): Promise<string[]> {
    const accounts = await db
      .selectFrom('account')
      .select('providerId')
      .where('userId', '=', userId)
      .execute()

    return accounts.map(account => account.providerId)
  }
}

export const userRepository = new UserRepository()
