import { created } from '../_helpers'

import { CreateTransactionService } from '@/services'
import {
    BodyHeadersController,
    CreateTransactionServiceParams,
    HttpRequest,
    HttpResponse,
    TransactionPublicResponse,
    UserIdRequestParams,
} from '@/shared'
import { ResponseMessage } from '@/shared'

// Local interfaces - used only by this controller
interface CreateTransactionParams {
    name: string
    amount: number
    date: string
    type: 'EARNING' | 'EXPENSE' | 'INVESTMENT'
}

interface CreateTransactionRequest extends HttpRequest {
    body: CreateTransactionParams
    headers: UserIdRequestParams
}

export class CreateTransactionController
    implements
        BodyHeadersController<
            CreateTransactionParams,
            UserIdRequestParams,
            TransactionPublicResponse
        >
{
    constructor(
        private readonly createTransactionService: CreateTransactionService,
    ) {}

    async execute(
        httpRequest: CreateTransactionRequest,
    ): Promise<HttpResponse<TransactionPublicResponse>> {
        // Validation is now handled by middleware
        const createTransactionParams = httpRequest.body
        const { userId } = httpRequest.headers

        const serviceParams: CreateTransactionServiceParams = {
            ...createTransactionParams,
            userId,
        }

        // Execute business logic - errors will be caught by error middleware
        const createdTransaction =
            await this.createTransactionService.execute(serviceParams)

        return created(createdTransaction, ResponseMessage.TRANSACTION_CREATED)
    }
}
