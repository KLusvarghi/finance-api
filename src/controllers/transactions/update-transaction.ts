import { HttpResponse } from '@/shared'
import {
    checkAmoutIsValid,
    checkIfIdIsValid,
    checkIsTypeValid,
    invalidAmoutResponse,
    invalidIdResponse,
    invalidTypeResponse,
    ok,
    requiredFieldMissingResponse,
    serverError,
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
            const params = httpRequest.body
            const transactionId = httpRequest.params.transactionId

            const isValidId = checkIfIdIsValid(transactionId)
            if (!isValidId) return invalidIdResponse()

            const requiredFields = ['name', 'date', 'amount', 'type']

            const { ok: requiredFieldsWereProvider, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requiredFieldsWereProvider) {
                return requiredFieldMissingResponse(missingField)
            }

            if (!checkAmoutIsValid(params.amount)) {
                return invalidAmoutResponse()
            }

            const type = params.type.trim().toUpperCase()

            const typeIsValid = checkIsTypeValid(type)

            if (!typeIsValid) {
                return invalidTypeResponse()
            }

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
