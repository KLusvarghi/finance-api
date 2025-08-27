import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userIdMissingResponse,
    userNotFoundResponse,
} from '../_helpers'
import { UserNotFoundError } from '@/errors'
export class GetUserByIdController {
    getUserByIdService
    constructor(getUserByIdService) {
        this.getUserByIdService = getUserByIdService
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            if (!userId) {
                return userIdMissingResponse()
            }
            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) return invalidIdResponse()
            const user = await this.getUserByIdService.execute(userId)
            return ok(user)
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse(error.message)
            }
            return serverError()
        }
    }
}
//# sourceMappingURL=get-user-by-id.js.map
