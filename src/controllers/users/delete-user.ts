import { notFoundResponse, ok, serverError } from '../_helpers'

import { UserNotFoundError } from '@/errors'
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
        try {
            const { userId } = httpRequest.headers

            const deletedUser = await this.deletedUserService.execute(userId)

            return ok(deletedUser, ResponseMessage.USER_DELETED)
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return notFoundResponse(error)
            }

            return serverError()
        }
    }
}
