import { ZodError } from 'zod'

import {
    badRequest,
    handleZodValidationError,
    ok,
    serverError,
} from '../_helpers'

import { LoginFailedError, TokenGenerationError } from '@/errors'
import { loginSchema } from '@/schemas'
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
            const { email, password } = httpRequest.body

            await loginSchema.parseAsync({ email, password })

            const user = await this.loginUserService.execute(email, password)

            return ok(user, ResponseMessage.USER_LOGIN_SUCCESS)
        } catch (error) {
            console.error(error)

            if (error instanceof ZodError) {
                return handleZodValidationError(error)
            }

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
