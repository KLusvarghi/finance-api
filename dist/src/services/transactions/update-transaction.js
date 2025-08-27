import { TransactionNotFoundError } from '@/errors'
export class UpdateTransactionService {
    updateTransactionRepository
    getTransactionByIdRepository
    constructor(updateTransactionRepository, getTransactionByIdRepository) {
        this.updateTransactionRepository = updateTransactionRepository
        this.getTransactionByIdRepository = getTransactionByIdRepository
    }
    async execute(transactionId, params) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)
        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }
        // if (params.userId && transaction.user_id !== params.userId) {
        //     throw new ForbiddenError()
        // }
        // const { user_id, ...updateParams } = params
        const updatedTransaction =
            await this.updateTransactionRepository.execute(
                transactionId,
                params,
            )
        if (!updatedTransaction) {
            throw new TransactionNotFoundError(transactionId)
        }
        // Convert to public response
        return {
            id: updatedTransaction.id,
            user_id: updatedTransaction.user_id,
            name: updatedTransaction.name,
            amount: updatedTransaction.amount,
            date: updatedTransaction.date,
            type: updatedTransaction.type,
        }
    }
}
//# sourceMappingURL=update-transaction.js.map
