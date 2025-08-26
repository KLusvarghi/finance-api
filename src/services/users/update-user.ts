import { PasswordHasherAdapter } from '@/adapters'
import {
    EmailAlreadyExistsError,
    UpdateUserFailedError,
    UserNotFoundError,
} from '@/errors'
import {
    GetUserByEmailRepository,
    GetUserByIdRepository,
    ServiceWithMultipleParams,
    UpdateUserParams,
    UpdateUserRepository,
    UserPublicResponse,
} from '@/shared'

export class UpdateUserService
    implements
        ServiceWithMultipleParams<string, UpdateUserParams, UserPublicResponse>
{
    private getUserByEmailRepository: GetUserByEmailRepository
    private updateUserRepository: UpdateUserRepository
    private passwordHasher: PasswordHasherAdapter
    private getUserByIdRepository: GetUserByIdRepository

    constructor(
        getUserByEmailRepository: GetUserByEmailRepository,
        updateUserRepository: UpdateUserRepository,
        passwordHasher: PasswordHasherAdapter,
        getUserByIdRepository: GetUserByIdRepository,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
        this.passwordHasher = passwordHasher
        this.getUserByIdRepository = getUserByIdRepository
    }

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

        const { password: _password, ...userWithoutPassword } = updatedUser
        return userWithoutPassword
    }
}
