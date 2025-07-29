import { GetUserByIdService } from '../services/get-user-by-id'
import {
    badRequest,
    serverError,
    ok,
    checkIfIdIsValid,
    invalidIdResponse,
    userNotFoundResponse,
} from '@/modules/helpers'

export class GetUserByIdController {
    async execute(httpRequest: any) {
        try {
            const userId = httpRequest.params.userId

            if (!userId) {
                return badRequest('Missing param: userId')
            }
            
            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) return invalidIdResponse


            const getUserByIdService = new GetUserByIdService()
            const user = await getUserByIdService.execute(userId)

            if (!user) {
                return userNotFoundResponse
            }

            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
