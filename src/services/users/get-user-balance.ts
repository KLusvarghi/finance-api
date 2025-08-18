import { UserNotFoundError } from '@/errors'
import {
    GetUserBalanceRepository,
    GetUserByIdRepository,
    SimpleService,
    UserBalanceRepositoryResponse,
} from '@/shared'

export class GetUserBalanceService
    implements SimpleService<string, UserBalanceRepositoryResponse>
{
    private getUserByIdRepository: GetUserByIdRepository
    private getUserBalanceRepository: GetUserBalanceRepository

    constructor(
        getUserByIdRepository: GetUserByIdRepository,
        getUserBalanceRepository: GetUserBalanceRepository,
    ) {
        this.getUserByIdRepository = getUserByIdRepository
        this.getUserBalanceRepository = getUserBalanceRepository
    }

    async execute(userId: string): Promise<UserBalanceRepositoryResponse> {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const userBalance = await this.getUserBalanceRepository.execute(userId)

        return userBalance
    }
}
