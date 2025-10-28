import { ForbiddenError, TransactionNotFoundError } from '@/errors'
import {
    GetTransactionByIdRepository,
    UpdateTransactionRepository,
} from '@/repositories/postgres'
import {
    ServiceWithMultipleParams,
    TransactionPublicResponse,
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
    constructor(
        private readonly updateTransactionRepository: UpdateTransactionRepository,
        private readonly getTransactionByIdRepository: GetTransactionByIdRepository,
    ) {}

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

        const { deletedAt: _deletedAt, ...updatedTransactionWithoutDeletedAt } =
            updatedTransaction
        return {
            ...updatedTransactionWithoutDeletedAt,
        }
    }
}
