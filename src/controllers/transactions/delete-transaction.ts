import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    transactionNotFoundResponse,
} from '../_helpers'
import {
    DeleteTransactionService,
    TransactionRepositoryResponse,
    HttpResponse,
    HttpRequest,
} from '@/shared/types'

export class DeleteTransactionController {
    private deleteTransactionService: DeleteTransactionService

    constructor(deleteTransactionService: DeleteTransactionService) {
        this.deleteTransactionService = deleteTransactionService
    }

    async execute(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse<TransactionRepositoryResponse>> {
        try {
            const transactionId = httpRequest.params.transactionId

            if (!checkIfIdIsValid(transactionId)) {
                return invalidIdResponse()
            }

            const deletedTransaction =
                await this.deleteTransactionService.execute(transactionId)

            if (!deletedTransaction) {
                return transactionNotFoundResponse()
            }

            return ok(deletedTransaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
