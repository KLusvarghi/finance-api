import { serverError, ok } from '@/shared'
import { GetUserByIdService } from '../../services/users/get-user-by-id'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    userNotFoundResponse,
    userBadRequestResponse,
} from '../_helpers/index'

export class GetUserByIdController {
    constructor(getUserByIdService: any) {
        this.getUserByIdService = getUserByIdService
    }
    async execute(httpRequest: any) {
        try {
            const userId = httpRequest.params.userId

            if (!userId) {
                return userBadRequestResponse()
            }

            const isIdValid = checkIfIdIsValid(userId)
            if (!isIdValid) return invalidIdResponse()

            const user = await this.getUserByIdService.execute(userId)

            if (!user) {
                return userNotFoundResponse()
            }

            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
