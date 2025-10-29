import { UserNotFoundError } from '@/errors'
import { GetUserByIdRepository } from '@/repositories/postgres'
import {
    GetTransactionsByUserIdParams,
    GetTransactionsByUserIdRepository,
    GetTransactionsByUserIdService as GetTransactionsByUserIdServiceInterface,
    PaginatedTransactionsResponse,
} from '@/shared'

export class GetTransactionsByUserIdService
    implements GetTransactionsByUserIdServiceInterface
{
    constructor(
        private readonly getUserByIdRepository: GetUserByIdRepository,
        private readonly getTransactionsByUserIdRepository: GetTransactionsByUserIdRepository,
    ) {}

    async execute(
        params: GetTransactionsByUserIdParams,
    ): Promise<PaginatedTransactionsResponse> {
        const user = await this.getUserByIdRepository.execute(params.userId)

        if (!user) {
            throw new UserNotFoundError(params.userId)
        }

        const result =
            await this.getTransactionsByUserIdRepository.execute(params)

        // Convert TransactionRepositoryResponse[] to TransactionPublicResponse[]
        const transactions = result.transactions.map(
            ({ deletedAt: _deletedAt, ...transactionWithoutDeletedAt }) => ({
                ...transactionWithoutDeletedAt,
            }),
        )

        return {
            transactions,
            nextCursor: result.nextCursor,
        }
    }
}
