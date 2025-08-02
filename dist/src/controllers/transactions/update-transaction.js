import { badRequest, checkAmoutIsValid, checkIfIdIsValid, checkIsTypeValid, invalidAmoutResponse, invalidIdResponse, invalidTypeResponse, ok, serverError, } from '../_helpers';
export class UpdateTransactionController {
    updateTransactionService;
    constructor(updateTransactionService) {
        this.updateTransactionService = updateTransactionService;
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId;
            const isValidId = checkIfIdIsValid(transactionId);
            if (!isValidId) {
                return invalidIdResponse();
            }
            const params = httpRequest.body;
            const allowedFields = ['name', 'date', 'amount', 'type'];
            const someFielsNotAllowed = Object.keys(params).some((fiels) => !allowedFields.includes(fiels));
            if (someFielsNotAllowed) {
                return badRequest('Some provided field is not allowed.');
            }
            if (params.amount) {
                if (!checkAmoutIsValid(params.amount)) {
                    return invalidAmoutResponse();
                }
            }
            if (params.type) {
                const type = params.type.trim().toUpperCase();
                const typeIsValid = checkIsTypeValid(type);
                if (!typeIsValid) {
                    return invalidTypeResponse();
                }
            }
            const updatedTransaction = await this.updateTransactionService.execute(transactionId, params);
            console.log(updatedTransaction);
            return ok(updatedTransaction);
        }
        catch (error) {
            console.error(error);
            return serverError();
        }
    }
}
