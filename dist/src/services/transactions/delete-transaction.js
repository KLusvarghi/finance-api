import { TransactionNotFoundError } from '@/errors'
export class DeleteTransactionService {
    deleteTransactionRepository
    getTransactionByIdRepository
    constructor(deleteTransactionRepository, getTransactionByIdRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository
        this.getTransactionByIdRepository = getTransactionByIdRepository
    }
    async execute(transactionId) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)
        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }
        // if (transaction.user_id !== userId) {
        //     throw new ForbiddenError()
        // }
        const deletedTransaction =
            await this.deleteTransactionRepository.execute(transactionId)
        if (!deletedTransaction) {
            throw new TransactionNotFoundError(transactionId)
        }
        // Convert to public response
        return {
            id: deletedTransaction.id,
            user_id: deletedTransaction.user_id,
            name: deletedTransaction.name,
            amount: deletedTransaction.amount,
            date: deletedTransaction.date,
            type: deletedTransaction.type,
        }
    }
}
//# sourceMappingURL=delete-transaction.js.map
