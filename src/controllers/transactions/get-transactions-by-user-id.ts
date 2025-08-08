import { UserNotFoundError } from '@/errors/user'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    requiredFieldMissingResponse,
    serverError,
    userNotFoundResponse,
} from '../_helpers'
import {
    GetTransactionsByUserIdService,
    TransactionRepositoryResponse,
    HttpResponse,
    HttpRequest,
} from '@/shared/types'

export class GetTransactionsByUserIdController {
    private getTransactionByUserIdService: GetTransactionsByUserIdService

    constructor(getTransactionByUserIdService: GetTransactionsByUserIdService) {
        this.getTransactionByUserIdService = getTransactionByUserIdService
    }

    async execute(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse<TransactionRepositoryResponse[] | null>> {
        try {
            // para que possamos pegar um valor que é passsado por uma query na url e não como um parametro no body, fazemos assim:
            const userId = httpRequest.query.userId

            if (!userId) {
                return requiredFieldMissingResponse('userId')
            }

            if (!checkIfIdIsValid(userId)) {
                return invalidIdResponse()
            }

            const transactions =
                await this.getTransactionByUserIdService.execute(userId)

            return ok(transactions)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse(error.message)
            }
            console.error(error)
            return serverError()
        }
    }
}
