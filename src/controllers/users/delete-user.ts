import { ok } from '../_helpers'

import {
    DeleteUserRequest,
    DeleteUserService,
    HeadersController,
    HttpResponse,
    ResponseMessage,
    UserIdRequestParams,
    UserPublicResponse,
} from '@/shared'

export class DeleteUserController
    implements HeadersController<UserIdRequestParams, UserPublicResponse>
{
    constructor(private readonly deletedUserService: DeleteUserService) {}

    async execute(
        httpRequest: DeleteUserRequest,
    ): Promise<HttpResponse<UserPublicResponse>> {
        const { userId } = httpRequest.headers

        // Execute business logic - errors will be caught by error middleware
        const deletedUser = await this.deletedUserService.execute(userId)

        return ok(deletedUser, ResponseMessage.USER_DELETED)
    }
}
