import { ok } from '../_helpers'

import {
    GetUserByIdRequest,
    GetUserByIdService,
    HeadersController,
    HttpResponse,
    UserIdRequestParams,
    UserPublicResponse,
} from '@/shared'

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
