import { ZodError } from 'zod'

import { created, handleZodValidationError, serverError } from '../_helpers'

import { createTransactionSchema } from '@/schemas'
import {
    Controller,
    CreateTransactionRequest,
    CreateTransactionService,
    HttpRequest,
    HttpResponse,
    ResponseMessage,
    TransactionPublicResponse,
} from '@/shared'

export class CreateTransactionController
    implements Controller<CreateTransactionRequest, TransactionPublicResponse>
{
    private createTransactionService: CreateTransactionService

    constructor(createTransactionService: CreateTransactionService) {
        this.createTransactionService = createTransactionService
    }

    async execute(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse<TransactionPublicResponse>> {
        try {
            const params = httpRequest.body

            // usando o "safeParseAsync" é uma forma de tratar os erros de forma mais segura e eveitar que de um throw e caia no catch e consigamos tratar o erro aqui ainda
            // await createTransactionSchema.safeParseAsync(params)
            const validatedParams =
                await createTransactionSchema.parseAsync(params)

            const createdTransaction =
                await this.createTransactionService.execute(validatedParams)

            return created(
                createdTransaction,
                ResponseMessage.TRANSACTION_CREATED,
            )
        } catch (error) {
            if (error instanceof ZodError) {
                return handleZodValidationError(error)
            }
            console.error(error)
            return serverError()
        }
    }
}
