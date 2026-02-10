import { userRepository } from '../repositories/user.repository.js'

/**
 * User Service
 * ユーザー関連のビジネスロジック層
 */
export class UserService {
  /**
   * ユーザーのアカウント情報を取得
   * @param userId ユーザーID
   * @returns アカウント情報配列
   */
  async getAccounts(userId: string) {
    const providerIds = await userRepository.getAccountProviders(userId)
    return providerIds.map(providerId => ({ providerId }))
  }
}

export const userService = new UserService()
