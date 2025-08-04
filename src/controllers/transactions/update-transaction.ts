import { HttpResponse, HttpRequest } from '@/shared/types'
import { ok, serverError } from '../_helpers'
import { updateTransactionSchema } from '@/schemas'
import {
    UpdateTransactionService,
    TransactionRepositoryResponse,
} from '@/shared/types'

export class UpdateTransactionController {
    private updateTransactionService: UpdateTransactionService

    constructor(updateTransactionService: UpdateTransactionService) {
        this.updateTransactionService = updateTransactionService
    }

    async execute(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse<TransactionRepositoryResponse | null>> {
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
