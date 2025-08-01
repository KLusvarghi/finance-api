import { HttpResponse } from '@/shared'
import {
    badRequest,
    checkAmoutIsValid,
    checkIfIdIsValid,
    checkIsTypeValid,
    invalidAmoutResponse,
    invalidIdResponse,
    invalidTypeResponse,
    ok,
    requiredFieldMissingResponse,
    serverError,
    transactionNotFoundResponse,
    validateRequiredFields,
} from '../_helpers'

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

            const isValidId = checkIfIdIsValid(transactionId)

            if (!isValidId) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            const allowedFields = ['name', 'date', 'amount', 'type']

            const someFielsNotAllowed = Object.keys(params).some(
                (fiels) => !allowedFields.includes(fiels), // verifica se algum campo que recebemos com params "params" não está presente em "allowedFields"
            )

            if (someFielsNotAllowed) {
                return badRequest('Some provided field is not allowed.')
            }

            if (params.amount) {
                if (!checkAmoutIsValid(params.amount)) {
                    return invalidAmoutResponse()
                }
            }

            if (params.type) {
                const type = params.type.trim().toUpperCase()

                const typeIsValid = checkIsTypeValid(type)

                if (!typeIsValid) {
                    return invalidTypeResponse()
                }
            }

            const updatedTransaction =
                await this.updateTransactionService.execute(
                    transactionId,
                    params,
                )

            if (!updatedTransaction) {
                return transactionNotFoundResponse()
            }

            return ok(updatedTransaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
