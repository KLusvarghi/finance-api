import { ZodError } from 'zod'

import {
    created,
    emailAlreadyExistsResponse,
    handleZodValidationError,
    serverError,
} from '../_helpers'

import { EmailAlreadyExistsError } from '@/errors'
import { createUserSchema } from '@/schemas'
import {
    Controller,
    CreateUserParams,
    CreateUserService,
    HttpRequest,
    HttpResponse,
    ResponseMessage,
    TokenGeneratorAdapterResponse,
    UserPublicResponse,
} from '@/shared'

export class CreateUserController
    implements
        Controller<
            CreateUserParams,
            UserPublicResponse & { tokens: TokenGeneratorAdapterResponse }
        >
{
    private createUserService: CreateUserService

    constructor(createUserService: CreateUserService) {
        this.createUserService = createUserService
    }

    async execute(
        httpRequest: HttpRequest,
    ): Promise<
        HttpResponse<
            UserPublicResponse & { tokens: TokenGeneratorAdapterResponse }
        >
    > {
        try {
            // validar a requisição (campos obrigatório, email e tamenho de senha)
            const params = httpRequest.body

            // validando o schema de forma asyncrona
            await createUserSchema.parseAsync(params as CreateUserParams)

            // rxecutamos nossa regra de negocio
            const createdUser = await this.createUserService.execute(
                params as CreateUserParams,
            )

            // retornar a resposta para o user (status code)
            return created(
                createdUser,
                ResponseMessage.USER_CREATED,
            ) as HttpResponse<
                UserPublicResponse & { tokens: TokenGeneratorAdapterResponse }
            >
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
