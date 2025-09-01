import { ZodError } from 'zod'

import {
    checkIfIdIsValid,
    forbidden,
    handleZodValidationError,
    invalidIdResponse,
    notFoundResponse,
    ok,
    requiredFieldMissingResponse,
    serverError,
} from '../_helpers'

import { ForbiddenError, TransactionNotFoundError } from '@/errors'
import { updateTransactionSchema } from '@/schemas'
import {
    BodyParamsHeadersController,
    HttpResponse,
    ResponseMessage,
    TransactionIdRequestParams,
    TransactionPublicResponse,
    UpdateTransactionParams,
    UpdateTransactionRequest,
    UpdateTransactionService,
    UpdateTransactionServiceParams,
    UserIdRequestParams,
} from '@/shared'

export class UpdateTransactionController
    implements
        BodyParamsHeadersController<
            UpdateTransactionParams,
            TransactionIdRequestParams,
            UserIdRequestParams,
            TransactionPublicResponse
        >
{
    constructor(
        private readonly updateTransactionService: UpdateTransactionService,
    ) {}

    async execute(
        httpRequest: UpdateTransactionRequest,
    ): Promise<HttpResponse<TransactionPublicResponse>> {
        try {
            const { transactionId } = httpRequest.params
            const { userId } = httpRequest.headers

            if (!transactionId) {
                return requiredFieldMissingResponse('transactionId')
            }

            if (!checkIfIdIsValid(transactionId)) {
                return invalidIdResponse('transactionId')
            }

            if (!userId) {
                return requiredFieldMissingResponse('userId')
            }

            const validatedParams = await updateTransactionSchema.parseAsync(
                httpRequest.body,
            )

            const serviceParams: UpdateTransactionServiceParams = {
                ...validatedParams,
                userId,
            }

            const updatedTransaction =
                await this.updateTransactionService.execute(
                    transactionId,
                    serviceParams,
                )

            return ok(updatedTransaction, ResponseMessage.TRANSACTION_UPDATED)
        } catch (error) {
            console.error(error)
            if (error instanceof TransactionNotFoundError) {
                return notFoundResponse(error)
            }
            // if (error instanceof ForbiddenError) {
            //     return unauthorized(
            //         'You do not have permission to update this transaction',
            //     )
            // }
            if (error instanceof ZodError) {
                return handleZodValidationError(error)
            }

            if (error instanceof ForbiddenError) {
                return forbidden()
            }
            return serverError()
        }
    }
}
