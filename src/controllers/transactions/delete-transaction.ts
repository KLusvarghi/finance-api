import { forbidden, notFoundResponse, ok, serverError } from '../_helpers'

import { ForbiddenError, TransactionNotFoundError } from '@/errors'
import {
    DeleteTransactionParams,
    DeleteTransactionRequest,
    DeleteTransactionService,
    DeleteTransactionServiceParams,
    HttpResponse,
    ParamsHeadersController,
    ResponseMessage,
    TransactionPublicResponse,
    UserIdRequestParams,
} from '@/shared'

export class DeleteTransactionController
    implements
        ParamsHeadersController<
            DeleteTransactionParams,
            UserIdRequestParams,
            TransactionPublicResponse
        >
{
    constructor(
        private readonly deleteTransactionService: DeleteTransactionService,
    ) {}

    async execute(
        httpRequest: DeleteTransactionRequest,
    ): Promise<HttpResponse<TransactionPublicResponse>> {
        try {
            const { transactionId } = httpRequest.params
            const { userId } = httpRequest.headers

            const serviceParams: DeleteTransactionServiceParams = {
                transactionId,
                userId,
            }

            const deletedTransaction: TransactionPublicResponse =
                await this.deleteTransactionService.execute(serviceParams)

            return ok(deletedTransaction, ResponseMessage.TRANSACTION_DELETED)
        } catch (error) {
            console.error(error)

            if (error instanceof TransactionNotFoundError) {
                return notFoundResponse(error)
            }

            if (error instanceof ForbiddenError) {
                return forbidden(
                    'You do not have permission to delete this transaction',
                )
            }

            return serverError()
        }
    }
}
