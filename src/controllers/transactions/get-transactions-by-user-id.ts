import { notFoundResponse, ok, serverError } from '../_helpers'

import { UserNotFoundError } from '@/errors'
import {
    GetTransactionsByUserIdRequest,
    GetTransactionsByUserIdService,
    HeadersController,
    HttpResponse,
    TransactionPublicResponse,
    UserIdRequestParams,
} from '@/shared'

export class GetTransactionsByUserIdController
    implements
        HeadersController<UserIdRequestParams, TransactionPublicResponse[]>
{
    constructor(
        private readonly getTransactionByUserIdService: GetTransactionsByUserIdService,
    ) {}

    async execute(
        httpRequest: GetTransactionsByUserIdRequest,
    ): Promise<HttpResponse<TransactionPublicResponse[]>> {
        try {
            // para que possamos pegar um valor que é passsado por uma query na url e não como um parametro no body, fazemos assim:
            const { userId } = httpRequest.headers

            const transactions =
                await this.getTransactionByUserIdService.execute(userId)

            return ok(transactions)
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return notFoundResponse(error)
            }
            return serverError()
        }
    }
}
