import { badRequest, ok, serverError } from '../_helpers'

import { LoginFailedError, TokenGenerationError } from '@/errors'
import {
    Controller,
    LoginUserRequest,
    LoginUserRequestParams,
    LoginUserService,
    ResponseMessage,
    UserPublicResponse,
} from '@/shared'

export class LoginUserController
    implements Controller<LoginUserRequestParams, UserPublicResponse>
{
    constructor(private readonly loginUserService: LoginUserService) {}

    async execute(httpRequest: LoginUserRequest) {
        try {
            // Validation is now handled by middleware
            const { email, password } = httpRequest.body

            const user = await this.loginUserService.execute(email, password)

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
