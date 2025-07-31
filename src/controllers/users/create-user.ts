import { EmailAlreadyExistsError } from '@/errors/user'
import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    emailIsAlreadyInUseResponse,
    invalidPasswordResponse,
    requiredFieldMissingResponse,
    validateRequiredFields,
} from '../_helpers/index'
import { serverError, badRequest, created } from '@/shared'

interface CreateUserService {
    execute(params: any): Promise<any>
}

export class CreateUserController {
    private createUserService: CreateUserService

    constructor(createUserService: CreateUserService) {
        this.createUserService = createUserService
    }
    async execute(httpRequest: any) {
        try {
            // validar a requisição (campos obrigatório, email e tamenho de senha)
            const params = httpRequest.body
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const { ok: requiredFieldsWereProvider, missingField } =
                validateRequiredFields(params, requiredFields)
            if (!requiredFieldsWereProvider)
                return requiredFieldMissingResponse(missingField)

            const passwordIsValid = checkIfPasswordIsValid(params.password)

            if (!passwordIsValid) {
                return invalidPasswordResponse()
            }

            const emailIsValid = checkIfEmailIsValid(params.email)
            if (!emailIsValid) {
                return emailIsAlreadyInUseResponse()
            }

            // rxecutamos nossa regra de negocio
            const createdUser = await this.createUserService.execute(params)

            // retornar a resposta para o user (status code)
            return created(createdUser)
        } catch (error) {
            if (error instanceof EmailAlreadyExistsError) {
                return badRequest(error.message)
            }
            console.error(error)
            return serverError()
        }
    }
}
