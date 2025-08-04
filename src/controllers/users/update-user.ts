import { EmailAlreadyExistsError } from '@/errors/user'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    userBadRequestResponse,
    userNotFoundResponse,
} from '../_helpers/index'

import { serverError, ok, badRequest } from '@/shared'
import { ZodError } from 'zod'
import { updateUserSchema } from '@/schemas'
import {
    UpdateUserService,
    UpdateUserParams,
    UserRepositoryResponse,
    HttpResponse,
    HttpRequest,
} from '@/shared/types'

export class UpdateUserController {
    private updateUserService: UpdateUserService

    constructor(updateUserService: UpdateUserService) {
        this.updateUserService = updateUserService
    }

    async execute(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse<UserRepositoryResponse>> {
        try {
            const userId = httpRequest.params.userId

            if (!userId) return userBadRequestResponse()

            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) return invalidIdResponse()

            const params = httpRequest.body

            await updateUserSchema.parseAsync(params)

            const updatedUser = await this.updateUserService.execute(
                userId,
                params,
            )

            if (!updatedUser) {
                return userNotFoundResponse()
            }

            // após chamar o service, já retornamos o status code, porque caso, dê algo errado no service ou no repositpry, eles vão instanciar um Error, e isso fará com que caia no catch
            return ok(updatedUser)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest(error.issues[0].message)
            }
            if (error instanceof EmailAlreadyExistsError) {
                return badRequest(error.message)
            }
            console.error(error)
            return serverError()
        }
    }
}
