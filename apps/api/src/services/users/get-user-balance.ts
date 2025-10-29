import { UserNotFoundError } from '@/errors'
import {
    GetUserBalanceRepository,
    GetUserByIdRepository,
} from '@/repositories/postgres'
import {
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
    constructor(
        private readonly getUserByIdRepository: GetUserByIdRepository,
        private readonly getUserBalanceRepository: GetUserBalanceRepository,
    ) {}

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
