import { notFoundResponse, ok, serverError } from '../_helpers'

import { UserNotFoundError } from '@/errors'
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
        try {
            const { userId } = httpRequest.headers

            const user = await this.getUserByIdService.execute(userId)

            return ok(user)
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return notFoundResponse(error)
            }

            return serverError()
        }
    }
}
