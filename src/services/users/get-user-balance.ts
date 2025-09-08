import { UserNotFoundError } from '@/errors'
import {
    GetUserBalanceRepository,
    GetUserByIdRepository,
    ServiceWithMultipleParams,
    UserBalanceRepositoryResponse,
} from '@/shared'

export class GetUserBalanceService
    implements
        ServiceWithMultipleParams<
            string,
            string,
            string,
            UserBalanceRepositoryResponse
        >
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

    async execute(
        userId: string,
        from: string,
        to: string,
    ): Promise<UserBalanceRepositoryResponse> {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const userBalance = await this.getUserBalanceRepository.execute(
            userId,
            from,
            to,
        )

        return userBalance
    }
}
