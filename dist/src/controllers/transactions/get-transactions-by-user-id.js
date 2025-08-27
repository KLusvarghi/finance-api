import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    requiredFieldMissingResponse,
    serverError,
    userNotFoundResponse,
} from '../_helpers'
import { UserNotFoundError } from '@/errors'
import { ResponseMessage } from '@/shared'
export class GetTransactionsByUserIdController {
    getTransactionByUserIdService
    constructor(getTransactionByUserIdService) {
        this.getTransactionByUserIdService = getTransactionByUserIdService
    }
    async execute(httpRequest) {
        try {
            // para que possamos pegar um valor que é passsado por uma query na url e não como um parametro no body, fazemos assim:
            const userId = httpRequest.query.userId
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
//# sourceMappingURL=get-transactions-by-user-id.js.map
