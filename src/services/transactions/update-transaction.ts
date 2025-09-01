import { ForbiddenError, TransactionNotFoundError } from '@/errors'
import {
    GetTransactionByIdRepository,
    ServiceWithMultipleParams,
    TransactionPublicResponse,
    UpdateTransactionRepository,
    UpdateTransactionServiceParams,
} from '@/shared'

export class UpdateTransactionService
    implements
        ServiceWithMultipleParams<
            string,
            UpdateTransactionServiceParams,
            TransactionPublicResponse
        >
{
    private updateTransactionRepository: UpdateTransactionRepository
    private getTransactionByIdRepository: GetTransactionByIdRepository

    constructor(
        updateTransactionRepository: UpdateTransactionRepository,
        getTransactionByIdRepository: GetTransactionByIdRepository,
    ) {
        this.updateTransactionRepository = updateTransactionRepository
        this.getTransactionByIdRepository = getTransactionByIdRepository
    }

    async execute(
        transactionId: string,
        params: UpdateTransactionServiceParams,
    ): Promise<TransactionPublicResponse> {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)

        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        if (transaction.userId !== params.userId) {
            throw new ForbiddenError()
        }

        const updatedTransaction =
            await this.updateTransactionRepository.execute(transactionId, {
                name: params.name,
                amount: params.amount,
                date: params.date,
                type: params.type,
            })

        if (!updatedTransaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        // Convert to public response
        return {
            id: updatedTransaction.id,
            userId: updatedTransaction.userId,
            name: updatedTransaction.name,
            amount: updatedTransaction.amount,
            date: updatedTransaction.date,
            type: updatedTransaction.type,
        }
    }
}
