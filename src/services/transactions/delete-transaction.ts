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
    ): Promise<TransactionRepositoryResponse | null> {
        const transactionDeleted =
            await this.deleteTransactionRepository.execute(transactionId)
        return transactionDeleted
    }
}
