import { UserNotFoundError } from '@/errors'
import {
    GetTransactionsByUserIdRepository,
    GetUserByIdRepository,
} from '@/repositories/postgres'
import { ServiceWithMultipleParams, TransactionPublicResponse } from '@/shared'

export class GetTransactionsByUserIdService
    implements
        ServiceWithMultipleParams<
            string,
            string,
            string,
            TransactionPublicResponse[]
        >
{
    constructor(
        private readonly getUserByIdRepository: GetUserByIdRepository,
        private readonly getTransactionsByUserIdRepository: GetTransactionsByUserIdRepository,
    ) {}

    async execute(
        userId: string,
        from: string,
        to: string,
    ): Promise<TransactionPublicResponse[]> {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactions =
            await this.getTransactionsByUserIdRepository.execute(
                userId,
                from,
                to,
            )

        // Garantir que sempre retornamos um array, mesmo se o repository retornar null
        const transactionsArray = transactions ?? []

        // Converter TransactionRepositoryResponse[] para TransactionPublicResponse[]
        return transactionsArray.map(
            ({ deletedAt, ...transactionWithoutDeletedAt }) => ({
                ...transactionWithoutDeletedAt,
            }),
        )
    }
}
