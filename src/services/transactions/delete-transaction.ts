import { ForbiddenError, TransactionNotFoundError } from '@/errors'
import {
    DeleteTransactionRepository,
    DeleteTransactionServiceParams,
    GetTransactionByUserIdRepository,
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
    private deleteTransactionRepository: DeleteTransactionRepository
    private getTransactionByIdRepository: GetTransactionByUserIdRepository

    constructor(
        deleteTransactionRepository: DeleteTransactionRepository,
        getTransactionByIdRepository: GetTransactionByUserIdRepository,
    ) {
        this.deleteTransactionRepository = deleteTransactionRepository
        this.getTransactionByIdRepository = getTransactionByIdRepository
    }

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
        return deletedTransaction
    }
}
