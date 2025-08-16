import { checkIfIdIsValid, handleZodValidationError, invalidIdResponse, ok, requiredFieldMissingResponse, serverError, } from '../_helpers';
import { updateTransactionSchema } from '@/schemas';
import { ZodError } from 'zod';
export class UpdateTransactionController {
    updateTransactionService;
    constructor(updateTransactionService) {
        this.updateTransactionService = updateTransactionService;
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId;
            if (!transactionId) {
                return requiredFieldMissingResponse('transactionId');
            }
            if (!checkIfIdIsValid(transactionId)) {
                return invalidIdResponse();
            }
            const params = httpRequest.body;
            await updateTransactionSchema.parseAsync(params);
            const updatedTransaction = await this.updateTransactionService.execute(transactionId, params);
            return ok(updatedTransaction);
        }
        catch (error) {
            if (error instanceof ZodError) {
                return handleZodValidationError(error);
            }
            console.error(error);
            return serverError();
        }
    }
}
//# sourceMappingURL=update-transaction.js.map