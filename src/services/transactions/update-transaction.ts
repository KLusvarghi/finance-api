import { ForbiddenError, TransactionNotFoundError } from '@/errors'
import {
    GetTransactionByIdRepository,
    ServiceWithMultipleParams,
    TransactionPublicResponse,
    UpdateTransactionParams,
    UpdateTransactionRepository,
} from '@/shared'

export class UpdateTransactionService
    implements
        ServiceWithMultipleParams<
            string,
            UpdateTransactionParams,
            unknown,
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
        params: UpdateTransactionParams,
    ): Promise<TransactionPublicResponse> {
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
