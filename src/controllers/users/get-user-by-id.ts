import { serverError, ok } from '@/shared'
import {
    GetUserByIdService,
    HttpResponse,
    HttpRequest,
    UserPublicResponse,
} from '@/shared/types'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    userNotFoundResponse,
    userBadRequestResponse,
} from '../_helpers/index'
import { UserNotFoundError } from '@/errors/user'

export class GetUserByIdController {
    private getUserByIdService: GetUserByIdService

    constructor(getUserByIdService: GetUserByIdService) {
        this.getUserByIdService = getUserByIdService
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
