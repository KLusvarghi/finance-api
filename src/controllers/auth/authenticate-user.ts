import { badRequest, ok, serverError } from '../_helpers'

import { LoginFailedError, TokenGenerationError } from '@/errors'
import {
    AuthenticateUserRequest,
    AuthenticateUserRequestParams,
    AuthenticateUserService,
    Controller,
    ResponseMessage,
    UserPublicResponse,
} from '@/shared'

export class AuthenticateUserController
    implements Controller<AuthenticateUserRequestParams, UserPublicResponse>
{
    constructor(
        private readonly authenticateUserService: AuthenticateUserService,
    ) {}

    async execute(httpRequest: AuthenticateUserRequest) {
        try {
            // Validation is now handled by middleware
            const { email, password } = httpRequest.body

            const user = await this.authenticateUserService.execute(
                email,
                password,
            )

            return ok(user, ResponseMessage.USER_LOGIN_SUCCESS)
        } catch (error) {
            console.error(error)

            if (error instanceof LoginFailedError) {
                return badRequest(error.message, error.code)
            }

            if (error instanceof TokenGenerationError) {
                return serverError(error.message, error.code)
            }

            return serverError()
        }
    }
}
