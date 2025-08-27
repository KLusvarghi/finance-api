import { UserNotFoundError } from '@/errors'
export class GetUserBalanceService {
    getUserByIdRepository
    getUserBalanceRepository
    constructor(getUserByIdRepository, getUserBalanceRepository) {
        this.getUserByIdRepository = getUserByIdRepository
        this.getUserBalanceRepository = getUserBalanceRepository
    }
    async execute(userId) {
        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError(userId)
        }
        const userBalance = await this.getUserBalanceRepository.execute(userId)
        return userBalance
    }
}
//# sourceMappingURL=get-user-balance.js.map
