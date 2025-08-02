import {
    checkIfIdIsValid,
    ok,
    serverError,
    userNotFoundResponse,
} from '../_helpers'

interface GetUserBalanceService {
    execute(userId: string): Promise<any>
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
                return userNotFoundResponse()
            }

            const userBalance = await this.getUserBalanceService.execute(userId)

            return ok(userBalance)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
