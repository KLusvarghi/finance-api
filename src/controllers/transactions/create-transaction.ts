import { ZodError } from 'zod'

import { created, handleZodValidationError, serverError } from '../_helpers'

import { createTransactionSchema } from '@/schemas'
import {
    BodyHeadersController,
    CreateTransactionParams,
    CreateTransactionRequest,
    CreateTransactionService,
    CreateTransactionServiceParams,
    HttpResponse,
    ResponseMessage,
    TransactionPublicResponse,
    UserIdRequestParams,
} from '@/shared'

export class CreateTransactionController
    implements
        BodyHeadersController<
            CreateTransactionParams,
            UserIdRequestParams,
            TransactionPublicResponse
        >
{
    constructor(
        private readonly createTransactionService: CreateTransactionService,
    ) {}

    async execute(
        httpRequest: CreateTransactionRequest,
    ): Promise<HttpResponse<TransactionPublicResponse>> {
        try {
            const createTransactionParams = httpRequest.body
            const { userId } = httpRequest.headers

            // usando o "safeParseAsync" é uma forma de tratar os erros de forma mais segura e eveitar que de um throw e caia no catch e consigamos tratar o erro aqui ainda
            // await createTransactionSchema.safeParseAsync(params)
            const validatedParams = await createTransactionSchema.parseAsync(
                createTransactionParams,
            )

            const serviceParams: CreateTransactionServiceParams = {
                ...validatedParams,
                userId,
            }

            const createdTransaction =
                await this.createTransactionService.execute(serviceParams)

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
