import { userRepository } from '../repositories/user.repository.js'

export class UserService {
  async getAccounts(userId: string) {
    const providerIds = await userRepository.getAccountProviders(userId)
    return providerIds.map(providerId => ({ providerId }))
  }
}

export const userService = new UserService()
