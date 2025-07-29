import { GetUserByIdService } from '../services/get-user-by-id'
import {
    badRequest,
    serverError,
    notFound,
    ok,
    checkIfIdIsValid,
    invalidIdResponse,
} from '@/modules/helpers'

export class GetUserByIdController {
    async execute(httpRequest: any) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) return invalidIdResponse

            if (!userId) {
                return badRequest('Missing param: userId')
            }

            const getUserByIdService = new GetUserByIdService()
            const user = await getUserByIdService.execute(userId)

            if (!user) {
                return notFound('User not found')
            }

            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
