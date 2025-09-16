import { PasswordHasherAdapter } from '@/adapters'
import {
    EmailAlreadyExistsError,
    UpdateUserFailedError,
    UserNotFoundError,
} from '@/errors'
import {
    GetUserByEmailRepository,
    GetUserByIdRepository,
    UpdateUserRepository,
} from '@/repositories/postgres'
import {
    ServiceWithMultipleParams,
    UpdateUserParams,
    UserPublicResponse,
} from '@/shared'

export class UpdateUserService
    implements
        ServiceWithMultipleParams<string, UpdateUserParams, UserPublicResponse>
{
    constructor(
        private readonly getUserByEmailRepository: GetUserByEmailRepository,
        private readonly updateUserRepository: UpdateUserRepository,
        private readonly passwordHasher: PasswordHasherAdapter,
        private readonly getUserByIdRepository: GetUserByIdRepository,
    ) {}

    async execute(
        userId: string,
        updateUserParams: UpdateUserParams,
    ): Promise<UserPublicResponse> {
        // 1. Primeiro verificar se o usuário que está sendo atualizado existe
        const existingUser = await this.getUserByIdRepository.execute(userId)
        if (!existingUser) {
            throw new UserNotFoundError(userId)
        }

        // 2. Se o email estiver sendo atualizado, verificar se já está em uso por outro usuário
        if (updateUserParams.email) {
            const userWithProvidedEmail =
                await this.getUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            // Verificar se o email já está em uso por outro usuário
            if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
                throw new EmailAlreadyExistsError(updateUserParams.email)
            }
        }

        const user = { ...updateUserParams }

        // 3. Se a senha estiver sendo atualizada, criptografá-la
        if (updateUserParams.password) {
            const hashPassword = await this.passwordHasher.execute(
                updateUserParams.password,
            )
            user.password = hashPassword
        }

        // 4. Chamar o repository para atualizar o user no banco de dados
        const updatedUser = await this.updateUserRepository.execute(
            userId,
            user,
        )

        if (!updatedUser) {
            throw new UpdateUserFailedError()
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = updatedUser
        return userWithoutPassword
    }
}
