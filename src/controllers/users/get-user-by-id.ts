import {
    checkIfIdIsValid,
    invalidIdResponse,
    notFoundResponse,
    ok,
    requiredFieldMissingResponse,
    serverError,
} from '../_helpers'

import { UserNotFoundError } from '@/errors'
import {
    Controller,
    GetUserByIdRequest,
    GetUserByIdService,
    HttpRequest,
    HttpResponse,
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
                return requiredFieldMissingResponse('userId')
            }

            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) return invalidIdResponse('userId')

            const user = await this.getUserByIdService.execute(userId)

            return ok(user)
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return notFoundResponse(error)
            }

            return serverError()
        }
    }
}
