import { EmailAlreadyExistsError } from '@/errors/user'
import {
    checkIfEmailIsValid,
    checkIfPasswordIsValid,
    emailIsAlreadyInUseResponse,
    invalidPasswordResponse,
} from '../_helpers/index'
import { serverError, badRequest, created } from '@/shared'

export class CreateUserController {
    constructor(createUserService: any) {
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

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest(`Missing param: ${field}`)
                }
            }

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
