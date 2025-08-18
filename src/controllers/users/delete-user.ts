import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userIdMissingResponse,
    userNotFoundResponse,
} from '../_helpers'

import { UserNotFoundError } from '@/errors'
import {
    Controller,
    DeleteUserRequest,
    DeleteUserService,
    HttpRequest,
    HttpResponse,
    ResponseMessage,
    UserPublicResponse,
} from '@/shared'

export class DeleteUserController
    implements Controller<DeleteUserRequest, UserPublicResponse>
{
    private deletedUserService: DeleteUserService

    constructor(deletedUserService: DeleteUserService) {
        this.deletedUserService = deletedUserService
    }

    async execute(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse<UserPublicResponse>> {
        try {
            const userId = (httpRequest.params as { userId: string }).userId

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
