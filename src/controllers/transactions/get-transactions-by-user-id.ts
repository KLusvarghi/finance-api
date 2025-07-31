import { UserNotFoundError } from '@/errors/user'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    requiredFieldMissingResponse,
    serverError,
    userNotFoundResponse,
} from '../_helpers'

export interface GetTransactionByUserIdService {
    execute(userId: string): Promise<any>
}

export class GetTransactionsByUserIdController {
    private getTransactionByUserIdService: GetTransactionByUserIdService

    constructor(getTransactionByUserIdService: GetTransactionByUserIdService) {
        this.getTransactionByUserIdService = getTransactionByUserIdService
    }

    async execute(httpRequst: any) {
        try {
            // para que possamos pegar um valor que é passsado por uma query na url e não como um parametro no body, fazemos assim:
            const userId = httpRequst.query.userId

            if (!userId) {
                return requiredFieldMissingResponse('userId is required')
            }

            if (!checkIfIdIsValid(userId)) {
                return invalidIdResponse()
            }

            const transactions =
                await this.getTransactionByUserIdService.execute(userId)

            return ok(transactions)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            console.error(error)
            return serverError()
        }
    }
}
