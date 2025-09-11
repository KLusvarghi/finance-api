import { created } from '../_helpers'

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
        // Validation is now handled by middleware
        const { refreshToken } = httpRequest.body

        // Execute business logic - errors will be caught by error middleware
        const tokens = await this.refreshTokenService.execute(refreshToken)

        return created(tokens, ResponseMessage.TOKEN_REFRESHED)
    }
}
