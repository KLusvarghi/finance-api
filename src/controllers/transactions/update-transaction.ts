import { ok } from '../_helpers'

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
        // Validation is now handled by middleware
        const { transactionId } = httpRequest.params
        const { userId } = httpRequest.headers
        const updateParams = httpRequest.body

        const serviceParams: UpdateTransactionServiceParams = {
            ...updateParams,
            userId,
        }

        // Execute business logic - errors will be caught by error middleware
        const updatedTransaction = await this.updateTransactionService.execute(
            transactionId,
            serviceParams,
        )

        return ok(updatedTransaction, ResponseMessage.TRANSACTION_UPDATED)
    }
}
