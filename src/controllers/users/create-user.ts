import { created } from '../_helpers'

import {
    BodyController,
    CreateUserParams,
    CreateUserRequest,
    CreateUserService,
    HttpResponse,
    ResponseMessage,
    TokensGeneratorAdapterResponse,
    UserPublicResponse,
} from '@/shared'

export class CreateUserController
    implements
        BodyController<
            CreateUserParams,
            UserPublicResponse & { tokens: TokensGeneratorAdapterResponse }
        >
{
    constructor(private readonly createUserService: CreateUserService) {}

    async execute(
        httpRequest: CreateUserRequest,
    ): Promise<
        HttpResponse<
            UserPublicResponse & { tokens: TokensGeneratorAdapterResponse }
        >
    > {
        // Validation is now handled by middleware
        const params = httpRequest.body as CreateUserParams

        // Execute business logic - errors will be caught by error middleware
        const createdUser = await this.createUserService.execute(params)

        // Return success response
        return created(
            createdUser,
            ResponseMessage.USER_CREATED,
        ) as HttpResponse<
            UserPublicResponse & { tokens: TokensGeneratorAdapterResponse }
        >
    }
}
