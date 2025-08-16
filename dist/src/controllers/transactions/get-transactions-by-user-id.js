import { UserNotFoundError } from '@/errors/user';
import { checkIfIdIsValid, invalidIdResponse, ok, requiredFieldMissingResponse, serverError, userNotFoundResponse, } from '../_helpers';
export class GetTransactionsByUserIdController {
    getTransactionByUserIdService;
    constructor(getTransactionByUserIdService) {
        this.getTransactionByUserIdService = getTransactionByUserIdService;
    }
    async execute(httpRequest) {
        try {
            // para que possamos pegar um valor que é passsado por uma query na url e não como um parametro no body, fazemos assim:
            const userId = httpRequest.query.userId;
            if (!userId) {
                return requiredFieldMissingResponse('userId');
            }
            if (!checkIfIdIsValid(userId)) {
                return invalidIdResponse();
            }
            const transactions = await this.getTransactionByUserIdService.execute(userId);
            return ok(transactions);
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
//# sourceMappingURL=get-transactions-by-user-id.js.map