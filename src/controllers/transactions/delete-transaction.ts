import {
    checkIfIdIsValid,
    invalidIdResponse,
    notFoundResponse,
    ok,
    requiredFieldMissingResponse,
    serverError,
    unauthorized,
} from '../_helpers'

import { ForbiddenError, TransactionNotFoundError } from '@/errors'
import {
    Controller,
    DeleteTransactionRequest,
    DeleteTransactionService,
    HttpRequest,
    HttpResponse,
    ResponseMessage,
    TransactionPublicResponse,
} from '@/shared'

export class DeleteTransactionController
    implements Controller<DeleteTransactionRequest, TransactionPublicResponse>
{
    private deleteTransactionService: DeleteTransactionService

    constructor(deleteTransactionService: DeleteTransactionService) {
        this.deleteTransactionService = deleteTransactionService
    }

    async execute(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse<TransactionPublicResponse>> {
        try {
            const transactionId = (
                httpRequest.params as { transactionId: string }
            ).transactionId
            // const { transactionId, userId } = httpRequest.params as {
            //     transactionId: string
            //     userId: string
            // }

            if (!transactionId) {
                return requiredFieldMissingResponse('transactionId')
            }

            if (!checkIfIdIsValid(transactionId)) {
                return invalidIdResponse('transactionId')
            }

            // if (!userId) {
            //     return unauthorized('User ID is required')
            // }

            const deletedTransaction: TransactionPublicResponse =
                await this.deleteTransactionService.execute(
                    transactionId,
                    // userId,
                )

            return ok(deletedTransaction, ResponseMessage.TRANSACTION_DELETED)
        } catch (error) {
            console.error(error)

            if (error instanceof TransactionNotFoundError) {
                return notFoundResponse(error)
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
