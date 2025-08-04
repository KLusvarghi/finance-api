import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import {
    CreateUserParams,
    CreateUserRepository,
    GetUserByEmailRepository,
    UserRepositoryResponse,
} from '@/shared/types'
import { EmailAlreadyExistsError } from '@/errors/user'

export class CreateUserService {
    private createUserRepository: CreateUserRepository
    private getUserByEmailRepository: GetUserByEmailRepository

    constructor(
        createUserRepository: CreateUserRepository,
        getUserByEmailRepository: GetUserByEmailRepository,
    ) {
        this.createUserRepository = createUserRepository
        this.getUserByEmailRepository = getUserByEmailRepository
    }

    async execute(
        createUserParams: CreateUserParams,
    ): Promise<UserRepositoryResponse> {
        const userWithProviderEmail =
            await this.getUserByEmailRepository.execute(createUserParams.email)

        if (userWithProviderEmail) {
            throw new EmailAlreadyExistsError(createUserParams.email)
        }

        const userId = uuidv4()

        // criptografdar a senha
        // sendo o "10" o "Salt", que é o nível de criptografia
        const hashPassword = await bcrypt.hash(createUserParams.password, 10)

        const user = {
            // dessestruturando o que a gente recebe como parametrp
            ...createUserParams,
            id: userId,
            // e colocando o password no final para ele sobrescrever o que está sendo desestruturado acima
            password: hashPassword,
        }

        const userResult = await this.createUserRepository.execute(user)

        return userResult
    }
}
