import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    transactionNotFoundResponse,
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
            const transactionId = httpRequest.params.transactionId as string
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

            const deletedTransaction: TransactionPublicResponse =
                await this.deleteTransactionService.execute(
                    transactionId,
                    // userId,
                )

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
