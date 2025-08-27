import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userIdMissingResponse,
    userNotFoundResponse,
} from '../_helpers'
import { UserNotFoundError } from '@/errors'
export class GetUserBalanceController {
    getUserBalanceService
    constructor(getUserBalanceService) {
        this.getUserBalanceService = getUserBalanceService
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            if (!userId) {
                return userIdMissingResponse()
            }
            if (!checkIfIdIsValid(userId)) {
                return invalidIdResponse()
            }
            const userBalance = await this.getUserBalanceService.execute(userId)
            return ok(userBalance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse(error.message)
            }
            console.error(error)
            return serverError()
        }
    }
}
//# sourceMappingURL=get-user-balance.js.map
