import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userIdMissingResponse,
    userNotFoundResponse,
} from '../_helpers'
import { UserNotFoundError } from '@/errors'
import { ResponseMessage } from '@/shared'
export class DeleteUserController {
    deletedUserService
    constructor(deletedUserService) {
        this.deletedUserService = deletedUserService
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            if (!userId) {
                return userIdMissingResponse()
            }
            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) return invalidIdResponse()
            const deletedUser = await this.deletedUserService.execute(userId)
            return ok(deletedUser, ResponseMessage.USER_DELETED)
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse(error.message)
            }
            return serverError()
        }
    }
}
//# sourceMappingURL=delete-user.js.map
