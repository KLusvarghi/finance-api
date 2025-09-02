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
    BodyController,
    CreateUserParams,
    CreateUserRequest,
    CreateUserService,
    HttpResponse,
    ResponseMessage,
    TokensGeneratorAdapterResponse,
    UserPublicResponse,
} from '@/shared'

export class CreateUserController
    implements
        BodyController<
            CreateUserParams,
            UserPublicResponse & { tokens: TokensGeneratorAdapterResponse }
        >
{
    constructor(private readonly createUserService: CreateUserService) {}

    async execute(
        httpRequest: CreateUserRequest,
    ): Promise<
        HttpResponse<
            UserPublicResponse & { tokens: TokensGeneratorAdapterResponse }
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
                UserPublicResponse & { tokens: TokensGeneratorAdapterResponse }
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
