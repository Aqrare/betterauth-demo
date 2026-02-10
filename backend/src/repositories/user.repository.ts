import { db } from '../db/index.js'

export class UserRepository {
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
