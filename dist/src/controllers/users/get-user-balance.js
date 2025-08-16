import { UserNotFoundError } from '@/errors/user';
import { checkIfIdIsValid, invalidIdResponse, ok, serverError, userBadRequestResponse, userNotFoundResponse, } from '../_helpers';
export class GetUserBalanceController {
    getUserBalanceService;
    constructor(getUserBalanceService) {
        this.getUserBalanceService = getUserBalanceService;
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;
            if (!userId) {
                return userBadRequestResponse();
            }
            if (!checkIfIdIsValid(userId)) {
                return invalidIdResponse();
            }
            const userBalance = await this.getUserBalanceService.execute(userId);
            return ok(userBalance);
        }
        catch (error) {
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse(error.message);
            }
            console.error(error);
            return serverError();
        }
    }
}
//# sourceMappingURL=get-user-balance.js.map