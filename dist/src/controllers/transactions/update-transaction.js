import { ZodError } from 'zod'
import {
    checkIfIdIsValid,
    handleZodValidationError,
    invalidIdResponse,
    ok,
    requiredFieldMissingResponse,
    serverError,
    transactionNotFoundResponse,
    unauthorized,
} from '../_helpers'
import { ForbiddenError, TransactionNotFoundError } from '@/errors'
import { updateTransactionSchema } from '@/schemas'
import { ResponseMessage } from '@/shared'
export class UpdateTransactionController {
    updateTransactionService
    constructor(updateTransactionService) {
        this.updateTransactionService = updateTransactionService
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            if (!transactionId) {
                return requiredFieldMissingResponse(
                    ResponseMessage.TRANSACTION_ID_MISSING,
                )
            }
            if (!checkIfIdIsValid(transactionId)) {
                return invalidIdResponse()
            }
            // if (!userId) {
            //     return unauthorized('User ID is required')
            // }
            const params = httpRequest.body
            const validatedParams =
                await updateTransactionSchema.parseAsync(params)
            const updatedTransaction =
                await this.updateTransactionService.execute(transactionId, {
                    ...validatedParams,
                })
            return ok(updatedTransaction, ResponseMessage.TRANSACTION_UPDATED)
        } catch (error) {
            console.error(error)
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse(error.message)
            }
            if (error instanceof ForbiddenError) {
                return unauthorized(
                    'You do not have permission to update this transaction',
                )
            }
            if (error instanceof ZodError) {
                return handleZodValidationError(error)
            }
            return serverError()
        }
    }
}
//# sourceMappingURL=update-transaction.js.map
