import { ok } from '../_helpers'

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
        // Validation is now handled by middleware
        const { email, password } = httpRequest.body

        // Execute business logic - errors will be caught by error middleware
        const user = await this.authenticateUserService.execute(email, password)

        return ok(user, ResponseMessage.USER_LOGIN_SUCCESS)
    }
}
