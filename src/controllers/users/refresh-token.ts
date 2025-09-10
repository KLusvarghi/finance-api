import jwt from 'jsonwebtoken'

import { created, serverError, unauthorized } from '../_helpers'

import { AppError, ErrorCode } from '@/errors'
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
            // Validation is now handled by middleware
            const { refreshToken } = httpRequest.body

            const tokens = await this.refreshTokenService.execute(refreshToken)

            return created(tokens, ResponseMessage.TOKEN_REFRESHED)
        } catch (error) {
            console.error(error)

            // Handle JWT-specific errors first
            if (error instanceof jwt.TokenExpiredError) {
                return unauthorized(
                    ResponseMessage.UNAUTHORIZED,
                    ErrorCode.TOKEN_EXPIRED,
                )
            }

            if (error instanceof jwt.JsonWebTokenError) {
                return unauthorized(
                    ResponseMessage.UNAUTHORIZED,
                    ErrorCode.TOKEN_INVALID,
                )
            }

            if (error instanceof jwt.NotBeforeError) {
                return unauthorized(
                    ResponseMessage.UNAUTHORIZED,
                    ErrorCode.TOKEN_NOT_ACTIVE,
                )
            }

            // Handle application-specific errors
            if (error instanceof AppError) {
                return unauthorized(ResponseMessage.UNAUTHORIZED, error.code)
            }

            return serverError()
        }
    }
}
