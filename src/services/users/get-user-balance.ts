import { UserNotFoundError } from '@/errors/user'
import {
    GetUserByIdRepository,
    GetUserBalanceRepository,
    UserBalanceRepositoryResponse,
} from '@/shared/types'

export class GetUserBalanceService {
    private getUserByIdRepository: GetUserByIdRepository
    private getUserBalanceRepository: GetUserBalanceRepository

    constructor(
        getUserByIdRepository: GetUserByIdRepository,
        getUserBalanceRepository: GetUserBalanceRepository,
    ) {
        this.getUserByIdRepository = getUserByIdRepository
        this.getUserBalanceRepository = getUserBalanceRepository
    }

    async execute(
        userId: string,
    ): Promise<UserBalanceRepositoryResponse> {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const userBalance = await this.getUserBalanceRepository.execute(
            userId,
        )

        return userBalance
    }
}
