import { created } from '../_helpers'

import {
    BodyHeadersController,
    CreateTransactionParams,
    CreateTransactionRequest,
    CreateTransactionService,
    CreateTransactionServiceParams,
    HttpResponse,
    ResponseMessage,
    TransactionPublicResponse,
    UserIdRequestParams,
} from '@/shared'

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
