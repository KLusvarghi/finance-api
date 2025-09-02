import jwt from 'jsonwebtoken'
import { ZodError } from 'zod'

import {
    handleZodValidationError,
    ok,
    serverError,
    unauthorized,
} from '../_helpers'

import { AppError } from '@/errors'
import { refreshTokenResponseSchema } from '@/schemas'
import { RefreshTokenService } from '@/services'
import {
    Controller,
    HttpResponse,
    RefreshTokenRequest,
    RefreshTokenRequestParams,
    RefreshTokenResponse,
    ResponseMessage,
} from '@/shared'

export class RefreshTokenController
    implements Controller<RefreshTokenRequestParams, RefreshTokenResponse>
{
    constructor(private readonly refreshTokenService: RefreshTokenService) {}

    async execute(
        httpRequest: RefreshTokenRequest,
    ): Promise<HttpResponse<RefreshTokenResponse>> {
        try {
            const { refreshToken } = httpRequest.body

            await refreshTokenResponseSchema.parseAsync({ refreshToken })

            const tokens = await this.refreshTokenService.execute(refreshToken)

            return ok(tokens, ResponseMessage.TOKEN_REFRESHED)
        } catch (error) {
            console.error(error)

            if (error instanceof ZodError) {
                return handleZodValidationError(error)
            }

            // Handle JWT-specific errors first
            if (error instanceof jwt.TokenExpiredError) {
                return unauthorized('TOKEN_EXPIRED')
            }

            if (error instanceof jwt.JsonWebTokenError) {
                return unauthorized('INVALID_TOKEN')
            }

            if (error instanceof jwt.NotBeforeError) {
                return unauthorized('TOKEN_NOT_ACTIVE')
            }

            // Handle application-specific errors
            if (error instanceof AppError) {
                return unauthorized(error.code)
            }

            return serverError()
        }
    }
}
