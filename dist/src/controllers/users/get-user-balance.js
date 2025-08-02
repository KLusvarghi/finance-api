import { UserNotFoundError } from '@/errors/user';
import { checkIfIdIsValid, invalidIdResponse, ok, serverError, userNotFoundResponse, } from '../_helpers';
export class GetUserBalanceController {
    getUserBalanceService;
    constructor(getUserBalanceService) {
        this.getUserBalanceService = getUserBalanceService;
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;
            if (!checkIfIdIsValid(userId)) {
                return invalidIdResponse();
            }
            const userBalance = await this.getUserBalanceService.execute({
                userId,
            });
            return ok(userBalance);
        }
        catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }
            console.error(error);
            return serverError();
        }
    }
}
