import { badRequest, ok, serverError } from '@/shared/http/reponse'
import { UpdateUserService } from '../services/update-user'
import isEmail from 'validator/lib/isEmail'
import isUUID from 'validator/lib/isUUID'
import { EmailAlreadyExistsError } from '@/errors/user'

export class UpdateUserController {
    async execute(httpRequest: any) {
        try {
            const userId = httpRequest.params.userId

            if (!userId) return badRequest('Missing param: userId')

            const isIdValid = isUUID(httpRequest.params.userId)

            if (!isIdValid) return badRequest('The provider id is not valid')

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const updateUserParams = httpRequest.body

            // 1. validar se algum campo não permitido foi passado
            const someFielsNotAllowed = Object.keys(updateUserParams).some(
                (fiels) => !allowedFields.includes(fiels), // verifica se algum campo que recebemos com params "updateUserParams" não está presente em "allowedFields"
            )

            if (someFielsNotAllowed) {
                return badRequest('Some provided field is not allowed.')
            }

            // 2. se receber password, validar o tamanho da string
            if (updateUserParams.password) {
                const passwordIsNotValid =
                    updateUserParams.password.trim().length < 6

                if (passwordIsNotValid) {
                    return badRequest('Password must be at least 6 characters')
                }
            }

            if (updateUserParams.email) {
                const emailIsValid = isEmail(updateUserParams.email)

                if (!emailIsValid) {
                    return badRequest(
                        'Invalid e-mail. Please provide a valid one.',
                    )
                }
            }

            const updateUserService = new UpdateUserService()
            const updatedUser = await updateUserService.execute(
                userId,
                updateUserParams,
            )

            // após chamar o service, já retornamos o status code, porque caso, dê algo errado no service ou no repositpry, eles vão instanciar um Error, e isso fará com que caia no catch
            return ok(updatedUser)
        } catch (error) {
            if (error instanceof EmailAlreadyExistsError) {
                return badRequest(error.message)
            }
            console.error(error)
            return serverError()
        }
    }
}
