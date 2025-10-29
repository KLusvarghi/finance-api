import { ForbiddenError, TransactionNotFoundError } from '@/errors'
import {
    DeleteTransactionRepository,
    GetTransactionByIdRepository,
} from '@/repositories/postgres'
import {
    DeleteTransactionServiceParams,
    ServiceWithMultipleParams,
    TransactionPublicResponse,
} from '@/shared'

export class DeleteTransactionService
    implements
        ServiceWithMultipleParams<
            DeleteTransactionServiceParams,
            unknown,
            TransactionPublicResponse
        >
{
    constructor(
        private readonly deleteTransactionRepository: DeleteTransactionRepository,
        private readonly getTransactionByIdRepository: GetTransactionByIdRepository,
    ) {}

    async execute({
        transactionId,
        userId,
    }: DeleteTransactionServiceParams): Promise<TransactionPublicResponse> {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)

        if (!transaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        if (transaction.userId !== userId) {
            throw new ForbiddenError()
        }

        const deletedTransaction =
            await this.deleteTransactionRepository.execute(transactionId)

        if (!deletedTransaction) {
            throw new TransactionNotFoundError(transactionId)
        }

        const { deletedAt: _deletedAt, ...deletedTransactionWithoutDeletedAt } =
            deletedTransaction
        return {
            ...deletedTransactionWithoutDeletedAt,
        }
    }
}
