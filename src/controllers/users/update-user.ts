import { ok } from '../_helpers'

import { UpdateUserService } from '@/services'
import {
    BodyHeadersController,
    HttpRequest,
    HttpResponse,
    UserIdRequestParams,
    UserPublicResponse,
} from '@/shared'
import { ResponseMessage } from '@/shared'

// Local interfaces - used only by this controller
interface UpdateUserParams {
    firstName?: string
    lastName?: string
    email?: string
    password?: string
}

interface UpdateUserRequest extends HttpRequest {
    body: UpdateUserParams
    headers: UserIdRequestParams
}

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
