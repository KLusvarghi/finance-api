import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
    transactionNotFoundResponse,
} from '../_helpers'

interface DeleteTransactionService {
    execute(transactionId: string): Promise<any>
}

export class DeleteTransactionController {
    private deleteTransactionService: DeleteTransactionService

    constructor(deleteTransactionService: DeleteTransactionService) {
        this.deleteTransactionService = deleteTransactionService
    }

    async execute(httpRequest: any) {
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
            serverError()
        }
    }
}
