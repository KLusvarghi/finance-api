import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    requiredFieldMissingResponse,
    serverError,
    userNotFoundResponse,
} from '../_helpers'

import { UserNotFoundError } from '@/errors'
import {
    Controller,
    GetTransactionsByUserIdRequest,
    GetTransactionsByUserIdService,
    HttpRequest,
    HttpResponse,
    ResponseMessage,
    TransactionPublicResponse,
} from '@/shared'

export class GetTransactionsByUserIdController {
    // implements
    //     Controller<GetTransactionsByUserIdRequest, TransactionPublicResponse[]>
    private getTransactionByUserIdService: GetTransactionsByUserIdService

    constructor(getTransactionByUserIdService: GetTransactionsByUserIdService) {
        this.getTransactionByUserIdService = getTransactionByUserIdService
    }

    async execute(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse<TransactionPublicResponse[]>> {
        try {
            // para que possamos pegar um valor que é passsado por uma query na url e não como um parametro no body, fazemos assim:
            const userId = (httpRequest.query as { userId: string }).userId

            if (!userId) {
                return requiredFieldMissingResponse(
                    ResponseMessage.USER_ID_MISSING,
                )
            }

            if (!checkIfIdIsValid(userId)) {
                return invalidIdResponse()
            }

            const transactions =
                await this.getTransactionByUserIdService.execute(userId)

            return ok(transactions)
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse(error.message)
            }
            return serverError()
        }
    }
}
