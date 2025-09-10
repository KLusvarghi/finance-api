import { created, emailAlreadyExistsResponse, serverError } from '../_helpers'

import { EmailAlreadyExistsError } from '@/errors'
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
        try {
            // Validation is now handled by middleware
            const params = httpRequest.body as CreateUserParams

            // Execute business logic
            const createdUser = await this.createUserService.execute(params)

            // Return response to user
            return created(
                createdUser,
                ResponseMessage.USER_CREATED,
            ) as HttpResponse<
                UserPublicResponse & { tokens: TokensGeneratorAdapterResponse }
            >
        } catch (error) {
            if (error instanceof EmailAlreadyExistsError) {
                return emailAlreadyExistsResponse(error.message)
            }
            console.error(error)
            return serverError()
        }
    }
}
