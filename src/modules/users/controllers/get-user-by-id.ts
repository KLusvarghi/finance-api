import { badRequest, serverError, notFound, ok } from '@/shared/http/reponse'
import { GetUserByIdService } from '../services/get-user-by-id'
import isUUID from 'validator/lib/isUUID'

export class GetUserByIdController {
    async execute(httpRequest: any) {
        try {
            const isIdValid = isUUID(httpRequest.params.userId)
            if (isIdValid) return badRequest('Invalid param: userId')

            const userId = httpRequest.params.userId

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
