import { ok } from '../_helpers'

import { DeleteTransactionService } from '@/services'
import {
    DeleteTransactionServiceParams,
    HttpRequest,
    HttpResponse,
    ParamsHeadersController,
    TransactionPublicResponse,
    UserIdRequestParams,
} from '@/shared'
import { ResponseMessage } from '@/shared'

// Local interfaces - used only by this controller
interface DeleteTransactionParams {
    transactionId: string
}

interface DeleteTransactionRequest extends HttpRequest {
    params: DeleteTransactionParams
    headers: UserIdRequestParams
}

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
        const { transactionId } = httpRequest.params
        const { userId } = httpRequest.headers

        const serviceParams: DeleteTransactionServiceParams = {
            transactionId,
            userId,
        }

        // Execute business logic - errors will be caught by error middleware
        const deletedTransaction: TransactionPublicResponse =
            await this.deleteTransactionService.execute(serviceParams)

        return ok(deletedTransaction, ResponseMessage.TRANSACTION_DELETED)
    }
}
