import {
    badRequest,
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from '@/modules/helpers'
import { DeleteUserService } from '../services/delete-user'

export class DeleteUserController {
    async execute(httpRequest: any) {
        try {
            const userId = httpRequest.params.userId

            if (!userId) {
                return badRequest('Missing param: userId')
            }

            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) return invalidIdResponse()

            const deleteUserRepository = new DeleteUserService()
            const deletedUser = await deleteUserRepository.execute(userId)

            if (!deletedUser) return userNotFoundResponse()

            return ok(deletedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
