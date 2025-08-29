import { ZodError } from 'zod'

import {
    handleZodValidationError,
    invalidPasswordResponse,
    notFoundResponse,
    ok,
    serverError,
} from '../_helpers'

import {
    InvalidPasswordError,
    TokenGenerationError,
    UserNotFoundError,
} from '@/errors'
import { loginSchema } from '@/schemas'
import { HttpRequest, LoginUserService, ResponseMessage } from '@/shared'

export class LoginUserController {
    constructor(private readonly loginUserService: LoginUserService) {
        this.loginUserService = loginUserService
    }

    async execute(httpRequest: HttpRequest) {
        try {
            const { email, password } = httpRequest.body as {
                email: string
                password: string
            }

            await loginSchema.parseAsync({ email, password })

            const user = await this.loginUserService.execute(email, password)

            return ok(user, ResponseMessage.USER_LOGIN_SUCCESS)
        } catch (error) {
            console.error(error)

            if (error instanceof ZodError) {
                return handleZodValidationError(error)
            }

            if (error instanceof UserNotFoundError) {
                return notFoundResponse(error)
            }

            if (error instanceof InvalidPasswordError) {
                return invalidPasswordResponse()
            }

            if (error instanceof TokenGenerationError) {
                return serverError(error.message, error.code)
            }

            return serverError()
        }
    }
}
