import { UserNotFoundError } from '@/errors'
import {
    GetTransactionsByUserIdRepository,
    GetUserByIdRepository,
    ServiceWithMultipleParams,
    TransactionPublicResponse,
} from '@/shared'

export class GetTransactionsByUserIdService
    implements
        ServiceWithMultipleParams<
            string,
            string,
            string,
            TransactionPublicResponse[]
        >
{
    private getUserByIdRepository: GetUserByIdRepository
    private getTransactionsByUserIdRepository: GetTransactionsByUserIdRepository

    constructor(
        getUserByIdRepository: GetUserByIdRepository,
        getTransactionsByUserIdRepository: GetTransactionsByUserIdRepository,
    ) {
        this.getUserByIdRepository = getUserByIdRepository
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
    }

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
        return transactionsArray.map((transaction) => ({
            id: transaction.id,
            userId: transaction.userId,
            name: transaction.name,
            amount: transaction.amount,
            date: transaction.date,
            type: transaction.type,
        }))
    }
}
