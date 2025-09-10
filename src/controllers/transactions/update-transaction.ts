import { forbidden, notFoundResponse, ok, serverError } from '../_helpers'

import { ForbiddenError, TransactionNotFoundError } from '@/errors'
import {
    BodyParamsHeadersController,
    HttpResponse,
    ResponseMessage,
    TransactionIdRequestParams,
    TransactionPublicResponse,
    UpdateTransactionParams,
    UpdateTransactionRequest,
    UpdateTransactionService,
    UpdateTransactionServiceParams,
    UserIdRequestParams,
} from '@/shared'

export class UpdateTransactionController
    implements
        BodyParamsHeadersController<
            UpdateTransactionParams,
            TransactionIdRequestParams,
            UserIdRequestParams,
            TransactionPublicResponse
        >
{
    constructor(
        private readonly updateTransactionService: UpdateTransactionService,
    ) {}

    async execute(
        httpRequest: UpdateTransactionRequest,
    ): Promise<HttpResponse<TransactionPublicResponse>> {
        try {
            // Validation is now handled by middleware
            const { transactionId } = httpRequest.params
            const { userId } = httpRequest.headers
            const updateParams = httpRequest.body

            const serviceParams: UpdateTransactionServiceParams = {
                ...updateParams,
                userId,
            }

            const updatedTransaction =
                await this.updateTransactionService.execute(
                    transactionId,
                    serviceParams,
                )

            return ok(updatedTransaction, ResponseMessage.TRANSACTION_UPDATED)
        } catch (error) {
            console.error(error)
            if (error instanceof TransactionNotFoundError) {
                return notFoundResponse(error)
            }

            if (error instanceof ForbiddenError) {
                return forbidden()
            }
            return serverError()
        }
    }
}
