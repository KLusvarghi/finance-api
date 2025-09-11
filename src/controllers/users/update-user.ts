import { ok } from '../_helpers'

import {
    BodyHeadersController,
    HttpResponse,
    ResponseMessage,
    UpdateUserParams,
    UpdateUserRequest,
    UpdateUserService,
    UserIdRequestParams,
    UserPublicResponse,
} from '@/shared'

export class UpdateUserController
    implements
        BodyHeadersController<
            UpdateUserParams,
            UserIdRequestParams,
            UserPublicResponse
        >
{
    constructor(private readonly updateUserService: UpdateUserService) {}

    async execute(
        httpRequest: UpdateUserRequest,
    ): Promise<HttpResponse<UserPublicResponse>> {
        // Validation is now handled by middleware
        const { userId } = httpRequest.headers
        const params = httpRequest.body

        // Execute business logic - errors will be caught by error middleware
        const updatedUser = await this.updateUserService.execute(userId, params)

        return ok(updatedUser, ResponseMessage.USER_UPDATED)
    }
}
