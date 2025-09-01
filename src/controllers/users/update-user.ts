import { ZodError } from 'zod'

import {
    emailAlreadyExistsResponse,
    handleZodValidationError,
    notFoundResponse,
    ok,
    serverError,
} from '../_helpers'

import {
    EmailAlreadyExistsError,
    UpdateUserFailedError,
    UserNotFoundError,
} from '@/errors'
import { updateUserSchema } from '@/schemas'
import {
    BodyHeadersController,
    HttpResponse,
    ResponseMessage,
    UpdateUserParams,
    UpdateUserRequest,
    UpdateUserService,
    UserIdRequestParams,
    UserPublicResponse,
} from '@/shared'

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
        try {
            const { userId } = httpRequest.headers
            const params = httpRequest.body

            const validatedParams = await updateUserSchema.parseAsync(params)

            const updatedUser = await this.updateUserService.execute(
                userId,
                validatedParams,
            )

            // após chamar o service, já retornamos o status code, porque caso, dê algo errado no service ou no repositpry, eles vão instanciar um Error, e isso fará com que caia no catch
            return ok(updatedUser, ResponseMessage.USER_UPDATED)
        } catch (error) {
            console.error(error)

            if (error instanceof ZodError) {
                return handleZodValidationError(error)
            }
            if (error instanceof EmailAlreadyExistsError) {
                return emailAlreadyExistsResponse(error.message)
            }
            if (error instanceof UserNotFoundError) {
                return notFoundResponse(error)
            }
            if (error instanceof UpdateUserFailedError) {
                return serverError(error.message, error.code)
            }

            return serverError()
        }
    }
}
