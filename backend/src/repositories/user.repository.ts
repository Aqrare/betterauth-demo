import { db } from '../db/index.js'

export class UserRepository {
  async getAccountProviders(userId: string): Promise<string[]> {
    const accounts = await db
      .selectFrom('account')
      .select('provider_id')
      .where('user_id', '=', userId)
      .execute()

    return accounts.map(account => account.provider_id)
  }
}

export const userRepository = new UserRepository()
