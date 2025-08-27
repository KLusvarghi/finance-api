import { ZodError } from 'zod'
import {
    created,
    emailAlreadyExistsResponse,
    handleZodValidationError,
    serverError,
} from '../_helpers'
import { EmailAlreadyExistsError } from '@/errors'
import { createUserSchema } from '@/schemas'
import { ResponseMessage } from '@/shared'
export class CreateUserController {
    createUserService
    constructor(createUserService) {
        this.createUserService = createUserService
    }
    async execute(httpRequest) {
        try {
            // validar a requisição (campos obrigatório, email e tamenho de senha)
            const params = httpRequest.body
            // validando o schema de forma asyncrona
            await createUserSchema.parseAsync(params)
            // rxecutamos nossa regra de negocio
            const createdUser = await this.createUserService.execute(params)
            // retornar a resposta para o user (status code)
            return created(createdUser, ResponseMessage.USER_CREATED)
        } catch (error) {
            if (error instanceof ZodError) {
                return handleZodValidationError(error)
            }
            if (error instanceof EmailAlreadyExistsError) {
                return emailAlreadyExistsResponse(error.message)
            }
            console.error(error)
            return serverError()
        }
    }
}
//# sourceMappingURL=create-user.js.map
