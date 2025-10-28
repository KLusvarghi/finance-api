import { RefreshTokenService } from '@/services'
import {
    Controller,
    HttpRequest,
    HttpResponse,
    RefreshTokenResponse,
} from '@/shared'
import { ResponseMessage } from '@/shared'

import { created } from '../_helpers'

// Local interfaces - used only by this controller
interface RefreshTokenRequestParams {
    refreshToken: string
}

export interface RefreshTokenRequest extends HttpRequest {
    body: RefreshTokenRequestParams
}

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
