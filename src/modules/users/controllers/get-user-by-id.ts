import { badRequest, serverError, notFound, ok } from '@/modules/helpers/http'
import { GetUserByIdService } from '../services/get-user-by-id'
import isUUID from 'validator/lib/isUUID'
import { invalidIdResponse } from '@/modules/helpers/user'

export class GetUserByIdController {
    async execute(httpRequest: any) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = isUUID(userId)
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
