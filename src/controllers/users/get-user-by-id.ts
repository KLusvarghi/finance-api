import { ok } from '../_helpers'

import { GetUserByIdService } from '@/services'
import {
    HeadersController,
    HttpRequest,
    HttpResponse,
    UserIdRequestParams,
    UserPublicResponse,
} from '@/shared'

// Local interfaces - used only by this controller
interface GetUserByIdRequest extends HttpRequest {
    headers: UserIdRequestParams
}

export class GetUserByIdController
    implements HeadersController<UserIdRequestParams, UserPublicResponse>
{
    constructor(private readonly getUserByIdService: GetUserByIdService) {}

    async execute(
        httpRequest: GetUserByIdRequest,
    ): Promise<HttpResponse<UserPublicResponse>> {
        const { userId } = httpRequest.headers

        // Execute business logic - errors will be caught by error middleware
        const user = await this.getUserByIdService.execute(userId)

        return ok(user)
    }
}
