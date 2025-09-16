import { ok } from '../_helpers'

import { UpdateTransactionService } from '@/services'
import {
    BodyParamsHeadersController,
    HttpRequest,
    HttpResponse,
    TransactionPublicResponse,
    UpdateTransactionServiceParams,
    UserIdRequestParams,
} from '@/shared'
import { ResponseMessage } from '@/shared'

// Local interfaces - used only by this controller
interface TransactionIdRequestParams {
    transactionId: string
}

interface UpdateTransactionParams {
    name?: string
    amount?: number
    date?: string
    type?: 'EARNING' | 'EXPENSE' | 'INVESTMENT'
}

interface UpdateTransactionRequest extends HttpRequest {
    body: UpdateTransactionParams
    params: TransactionIdRequestParams
    headers: UserIdRequestParams
}

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
