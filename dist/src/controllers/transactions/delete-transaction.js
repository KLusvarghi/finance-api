import { TransactionNotFoundError } from '@/errors/user';
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
            return ok(deletedTransaction, 'Transaction deleted successfully');
        }
        catch (error) {
            console.error(error);
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse();
            }
            return serverError();
        }
    }
}
//# sourceMappingURL=delete-transaction.js.map