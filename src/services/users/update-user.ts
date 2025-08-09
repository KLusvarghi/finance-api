import {
    EmailAlreadyExistsError,
    UpdateUserFailedError,
    UserNotFoundError,
} from '@/errors/user'
import {
    UpdateUserParams,
    GetUserByEmailRepository,
    UpdateUserRepository,
    UserRepositoryResponse,
} from '@/shared/types'
import { PasswordHasherAdapter } from '@/adapters'

export class UpdateUserService {
    private getUserByEmailRepository: GetUserByEmailRepository
    private updateUserRepository: UpdateUserRepository
    private passwordHasher: PasswordHasherAdapter

    constructor(
        getUserByEmailRepository: GetUserByEmailRepository,
        updateUserRepository: UpdateUserRepository,
        passwordHasher: PasswordHasherAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
        this.passwordHasher = passwordHasher
    }

    async execute(
        userId: string,
        updateUserParams: UpdateUserParams,
    ): Promise<UserRepositoryResponse | null> {
        const hasUserWithProvidedEmail =
            await this.getUserByEmailRepository.execute(updateUserParams.email!)

        if (!hasUserWithProvidedEmail) {
            throw new UserNotFoundError(userId)
        }

        // 1. se o email estiver sendo atualizado, verificar se já está em uso
        if (updateUserParams.email) {
            const userWithProviderEmail =
                await this.getUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            // além de validar se o email já está em uso, validamos se o email a ser atualizado é diferente da pessoa que está atualizando, e caso sim, ele entra na condição e invalida a açao
            if (userWithProviderEmail && userWithProviderEmail.id !== userId) {
                throw new EmailAlreadyExistsError(updateUserParams.email)
            }
        }

        const user = { ...updateUserParams }

        // 2. se a senha estiver sendo atualizado, criptogra-lá
        if (updateUserParams.password) {
            const hashPassword = await this.passwordHasher.execute(
                updateUserParams.password,
            )
            user.password = hashPassword // assim a gente adiciona ou substitui a props "password" com o valor de hashPassword

            // poderiamos fazer dessa maneira abaixo tbm, mas, para deixar masi claro e separar o que vem e o que retornamos, é melhor criar outra variável
            // updateUserParams.password = hashPassword
        }

        // 3. chamar o repository para atualizar o user no banco de dados
        const updatedUser = await this.updateUserRepository.execute(
            userId,
            user,
        )

        if (!updatedUser) {
            throw new UpdateUserFailedError()
        }

        return updatedUser
    }
}
