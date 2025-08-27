import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    transactionNotFoundResponse,
    unauthorized,
} from '../_helpers'
import { ForbiddenError, TransactionNotFoundError } from '@/errors'
import { ResponseMessage } from '@/shared'
export class DeleteTransactionController {
    deleteTransactionService
    constructor(deleteTransactionService) {
        this.deleteTransactionService = deleteTransactionService
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            // const { transactionId, userId } = httpRequest.params as {
            //     transactionId: string
            //     userId: string
            // }
            if (!checkIfIdIsValid(transactionId)) {
                return invalidIdResponse()
            }
            // if (!userId) {
            //     return unauthorized('User ID is required')
            // }
            const deletedTransaction =
                await this.deleteTransactionService.execute(transactionId)
            return ok(deletedTransaction, ResponseMessage.TRANSACTION_DELETED)
        } catch (error) {
            console.error(error)
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse(error.message)
            }
            if (error instanceof ForbiddenError) {
                return unauthorized(
                    'You do not have permission to delete this transaction',
                )
            }
            return serverError()
        }
    }
}
//# sourceMappingURL=delete-transaction.js.map
