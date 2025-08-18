import { ZodError } from 'zod'

import {
    checkIfIdIsValid,
    emailAlreadyExistsResponse,
    handleZodValidationError,
    invalidIdResponse,
    ok,
    serverError,
    userIdMissingResponse,
    userNotFoundResponse,
} from '../_helpers'

import {
    EmailAlreadyExistsError,
    UpdateUserFailedError,
    UserNotFoundError,
} from '@/errors'
import { updateUserSchema } from '@/schemas'
import {
    Controller,
    HttpRequest,
    HttpResponse,
    UpdateUserRequest,
    UpdateUserService,
    UserPublicResponse,
} from '@/shared'

export class UpdateUserController
    // implements Controller<UpdateUserRequest, UserPublicResponse>
{
    private updateUserService: UpdateUserService

    constructor(updateUserService: UpdateUserService) {
        this.updateUserService = updateUserService
    }

    async execute(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse<UserPublicResponse>> {
        try {
            const userId = (httpRequest.params as { userId: string }).userId
            if (!userId) return userIdMissingResponse()

            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) return invalidIdResponse()

            const params = httpRequest.body
            const validatedParams = await updateUserSchema.parseAsync(params)

            const updatedUser = await this.updateUserService.execute(
                userId,
                validatedParams,
            )

            // após chamar o service, já retornamos o status code, porque caso, dê algo errado no service ou no repositpry, eles vão instanciar um Error, e isso fará com que caia no catch
            return ok(updatedUser)
        } catch (error) {
            console.error(error)

            if (error instanceof ZodError) {
                return handleZodValidationError(error)
            }
            if (error instanceof EmailAlreadyExistsError) {
                return emailAlreadyExistsResponse(error.message)
            }
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse(error.message)
            }
            if (error instanceof UpdateUserFailedError) {
                return serverError(error.message, error.code)
            }

            return serverError()
        }
    }
}
