import { badRequest, created, serverError } from '../_helpers'
import { createTransactionSchema } from '@/schemas'
import { ZodError } from 'zod'
import {
    CreateTransactionService,
    HttpResponse,
    HttpRequest,
    TransactionPublicResponse,
} from '@/shared/types'

export class CreateTransactionController {
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
            await createTransactionSchema.parseAsync(params)

            const createdTransaction =
                await this.createTransactionService.execute(params)

            return created(createdTransaction)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest(error.issues[0].message)
            }
            console.error(error)
            return serverError()
        }
    }
}
