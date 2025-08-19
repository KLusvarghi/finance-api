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
    GetUserByIdRequest,
    GetUserByIdService,
    HttpRequest,
    HttpResponse,
    ResponseMessage,
    UserPublicResponse,
} from '@/shared'

export class GetUserByIdController
    implements Controller<GetUserByIdRequest, UserPublicResponse>
{
    private getUserByIdService: GetUserByIdService

    constructor(getUserByIdService: GetUserByIdService) {
        this.getUserByIdService = getUserByIdService
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
