import { checkIfIdIsValid, invalidIdResponse, ok, serverError, transactionNotFoundResponse, } from '../_helpers';
export class DeleteTransactionController {
    deleteTransactionService;
    constructor(deleteTransactionService) {
        this.deleteTransactionService = deleteTransactionService;
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId;
            if (!checkIfIdIsValid(transactionId)) {
                return invalidIdResponse();
            }
            const deletedTransaction = await this.deleteTransactionService.execute(transactionId);
            if (!deletedTransaction) {
                return transactionNotFoundResponse();
            }
            return ok(deletedTransaction);
        }
        catch (error) {
            console.error(error);
            serverError();
        }
    }
}
