import { HttpResponse } from '@/shared'
import { ok, serverError } from '../_helpers'
import { updateTransactionSchema } from '@/schemas'

interface UpdateTransactionService {
    execute(transactionId: string, params: any): Promise<any>
}

export class UpdateTransactionController {
    private updateTransactionService: UpdateTransactionService

    constructor(updateTransactionService: UpdateTransactionService) {
        this.updateTransactionService = updateTransactionService
    }

    async execute(httpRequest: any): Promise<HttpResponse> {
        try {
            const transactionId = httpRequest.params.transactionId

            const params = httpRequest.body

            await updateTransactionSchema.parseAsync(params)

            const updatedTransaction =
                await this.updateTransactionService.execute(
                    transactionId,
                    params,
                )

            return ok(updatedTransaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
