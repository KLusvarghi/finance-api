import { DeleteUserService } from '@/services'
import {
    HeadersController,
    HttpRequest,
    HttpResponse,
    UserIdRequestParams,
    UserPublicResponse,
} from '@/shared'
import { ResponseMessage } from '@/shared'

import { ok } from '../_helpers'

// Local interfaces - used only by this controller
interface DeleteUserRequest extends HttpRequest {
    headers: UserIdRequestParams
}

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
