import isCurrency from 'validator/lib/isCurrency'

import {
    badRequest,
    checkIfIdIsValid,
    created,
    invalidIdResponse,
    requiredFieldMissingResponse,
    serverError,
    validateRequiredFields,
} from '../_helpers'

interface CreateTransactionService {
    execute(params: any): Promise<any>
}

export class CreateTransactionController {
    private createTransactionService: CreateTransactionService

    constructor(createTransactionService: CreateTransactionService) {
        this.createTransactionService = createTransactionService
    }

    async execute(httpRequest: any) {
        try {
            const params = httpRequest.body
            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            const { ok: requiredFieldsWereProvider, missingField } =
                validateRequiredFields(params, requiredFields)
            if (!requiredFieldsWereProvider)
                return requiredFieldMissingResponse(missingField)

            const userIdIsValid = checkIfIdIsValid(params.user_id)

            if (!userIdIsValid) return invalidIdResponse()

            if (params.amount <= 0) return badRequest('Invalid amount')

            const amountValid = isCurrency(params.amount.toString(), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.',
            })

            if (!amountValid) return badRequest('Invalid amount')

            const type = params.type.trim().toUpperCase()

            const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(
                type,
            )

            if (!typeIsValid) return badRequest('Transaction type is invalid')

            const createdTransaction =
                await this.createTransactionService.execute({
                    ...params,
                    amount: params.amount,
                    type, // passando o type dnv porque nós tranformamos ele
                })

            return created(createdTransaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
