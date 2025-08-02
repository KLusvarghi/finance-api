import { UserNotFoundError } from '@/errors/user'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from '../_helpers'

interface GetUserBalanceService {
    execute({ params }: any): Promise<any>
}

export class GetUserBalanceController {
    private getUserBalanceService: GetUserBalanceService

    constructor(getUserBalanceService: GetUserBalanceService) {
        this.getUserBalanceService = getUserBalanceService
    }

    async execute(httpRequest: any) {
        try {
            const userId = httpRequest.params.userId

            if (!checkIfIdIsValid(userId)) {
                return invalidIdResponse()
            }

            const userBalance = await this.getUserBalanceService.execute({
                userId,
            })

            return ok(userBalance)
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }
            console.error(error)
            return serverError()
        }
    }
}
