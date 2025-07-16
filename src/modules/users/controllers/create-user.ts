import { serverError, badRequest, created } from '@/shared/http/reponse'
import { CreateUserService } from '../services/create-user'
import isEmail from 'validator/lib/isEmail'

export class CreateUserController {
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

            const passwordInvalid = params.password.trim().length < 6
           
            if (passwordInvalid) {
                return badRequest('Password must be at least 6 characters')
            }

            const emailIsValid = isEmail(params.email)
            if (!emailIsValid) {
                return badRequest('Invalid e-mail. Please provide a valid one.')
            }

            // chamar o service
            const createUserService = new CreateUserService()
            const createdUser = await createUserService.execute(params)

            // retornar a resposta para o user (status code)
            return created(createdUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
