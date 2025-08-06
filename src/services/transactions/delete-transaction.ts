import { TransactionNotFoundError } from '@/errors/user'
import {
    DeleteTransactionRepository,
    TransactionRepositoryResponse,
} from '@/shared/types'

export class DeleteTransactionService {
    private deleteTransactionRepository: DeleteTransactionRepository

    constructor(deleteTransactionRepository: DeleteTransactionRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository
    }

    async execute(
        transactionId: string,
    ): Promise<TransactionRepositoryResponse> {
        const transactionDeleted =
            await this.deleteTransactionRepository.execute(transactionId)

        if (!transactionDeleted) {
            throw new TransactionNotFoundError(transactionId)
        }

        return transactionDeleted
    }
}
