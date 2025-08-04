import { TransactionNotFoundError } from '@/errors/user'
import {
    UpdateTransactionRepository,
    UpdateTransactionParams,
    TransactionRepositoryResponse,
} from '@/shared/types'

export class UpdateTransactionService {
    private updateTransactionRepository: UpdateTransactionRepository

    constructor(updateTransactionRepository: UpdateTransactionRepository) {
        this.updateTransactionRepository = updateTransactionRepository
    }

    async execute(
        transactionId: string,
        params: UpdateTransactionParams,
    ): Promise<TransactionRepositoryResponse | null> {
        const transaction = await this.updateTransactionRepository.execute(
            transactionId,
            params,
        )

        if (!transaction) {
            throw new TransactionNotFoundError()
        }

        return transaction
    }
}
