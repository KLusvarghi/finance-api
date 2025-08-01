import {
    checkAmoutIsValid,
    checkIfIdIsValid,
    checkIsTypeValid,
    created,
    invalidAmoutResponse,
    invalidIdResponse,
    invalidTypeResponse,
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
                
            if (!requiredFieldsWereProvider){
              return requiredFieldMissingResponse(missingField)
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id)

            if (!userIdIsValid){
              return invalidIdResponse()
            }

            if (!checkAmoutIsValid(params.amount)){
              return invalidAmoutResponse()
            }

            const type = params.type.trim().toUpperCase()

            const typeIsValid = checkIsTypeValid(type)

            if (!typeIsValid) {
              return invalidTypeResponse
            }

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
