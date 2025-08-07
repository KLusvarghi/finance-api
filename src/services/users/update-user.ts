import { EmailAlreadyExistsError, UpdateUserFailedError, UserNotFoundError } from '@/errors/user'
import bcrypt from 'bcrypt'
import {
    UpdateUserParams,
    GetUserByEmailRepository,
    UpdateUserRepository,
    UserRepositoryResponse,
} from '@/shared/types'

export class UpdateUserService {
    private getUserByEmailRepository: GetUserByEmailRepository
    private updateUserRepository: UpdateUserRepository

    constructor(
        getUserByEmailRepository: GetUserByEmailRepository,
        updateUserRepository: UpdateUserRepository,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
    }

    async execute(
        userId: string,
        updateUserParams: UpdateUserParams,
    ): Promise<UserRepositoryResponse | null> {
        const hasUserWithProvidedEMail = await this.getUserByEmailRepository.execute(
            updateUserParams.email!,
        )

        if (!hasUserWithProvidedEMail) {
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
            const hashPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
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
