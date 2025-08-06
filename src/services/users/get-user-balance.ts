import { UserNotFoundError } from '@/errors/user'
import {
    GetUserByIdRepository,
    GetUserBalanceRepository,
    GetUserBalanceParams,
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
        params: GetUserBalanceParams,
    ): Promise<UserBalanceRepositoryResponse> {
        const user = await this.getUserByIdRepository.execute(params.userId)

        if (!user) {
            throw new UserNotFoundError(params.userId)
        }

        const userBalance = await this.getUserBalanceRepository.execute(
            params.userId,
        )

        return userBalance
    }
}
