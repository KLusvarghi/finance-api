import { UserNotFoundError } from '@/errors'
export class GetTransactionsByUserIdService {
    getUserByIdRepository
    getTransactionsByUserIdRepository
    constructor(getUserByIdRepository, getTransactionsByUserIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
    }
    async execute(userId) {
        const user = await this.getUserByIdRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError(userId)
        }
        const transactions =
            await this.getTransactionsByUserIdRepository.execute(userId)
        // Garantir que sempre retornamos um array, mesmo se o repository retornar null
        const transactionsArray = transactions ?? []
        // Converter TransactionRepositoryResponse[] para TransactionPublicResponse[]
        return transactionsArray.map((transaction) => ({
            id: transaction.id,
            user_id: transaction.user_id,
            name: transaction.name,
            amount: transaction.amount,
            date: transaction.date,
            type: transaction.type,
        }))
    }
}
//# sourceMappingURL=get-transactions-by-user-id.js.map
