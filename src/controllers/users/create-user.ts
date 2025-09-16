import { created } from '../_helpers'

import { CreateUserService } from '@/services'
import {
    BodyController,
    HttpRequest,
    HttpResponse,
    UserWithTokensResponse,
} from '@/shared'
import { ResponseMessage } from '@/shared'

// Local interfaces - used only by this controller
interface CreateUserParams {
    firstName: string
    lastName: string
    email: string
    password: string
}

interface CreateUserRequest extends HttpRequest {
    body: CreateUserParams
}

export class CreateUserController
    implements BodyController<CreateUserParams, UserWithTokensResponse>
{
    constructor(private readonly createUserService: CreateUserService) {}

    async execute(
        httpRequest: CreateUserRequest,
    ): Promise<HttpResponse<UserWithTokensResponse>> {
        // Validation is now handled by middleware
        const params = httpRequest.body as CreateUserParams

        // Execute business logic - errors will be caught by error middleware
        const createdUser = await this.createUserService.execute(params)

        // Return success response
        return created(
            createdUser,
            ResponseMessage.USER_CREATED,
        ) as HttpResponse<UserWithTokensResponse>
    }
}
