import {
    checkIfIdIsValid,
    invalidIdResponse,
    userBadRequestResponse,
    userNotFoundResponse,
} from '../_helpers/index'
import { UserNotFoundError } from '@/errors/user'

import { serverError, ok } from '@/shared'
import {
    DeleteUserService,
    HttpResponse,
    HttpRequest,
    UserPublicResponse,
} from '@/shared/types'

export class DeleteUserController {
    private deletedUserService: DeleteUserService

    constructor(deletedUserService: DeleteUserService) {
        this.deletedUserService = deletedUserService
    }

    async execute(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse<UserPublicResponse>> {
        try {
            const userId = httpRequest.params.userId

            if (!userId) {
                return userBadRequestResponse()
            }

            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) return invalidIdResponse()

            const deletedUser = await this.deletedUserService.execute(userId)

            return ok(deletedUser)
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return serverError()
        }
    }
}
