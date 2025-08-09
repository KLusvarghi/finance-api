import {
    CreateUserParams,
    CreateUserRepository,
    GetUserByEmailRepository,
    UserPublicResponse,
} from '@/shared/types'
import { EmailAlreadyExistsError } from '@/errors/user'
import { IdGeneratorAdapter, PasswordHasherAdapter } from '@/adapters'

export class CreateUserService {
    private createUserRepository: CreateUserRepository
    private getUserByEmailRepository: GetUserByEmailRepository
    private idGenerator: IdGeneratorAdapter
    private passwordHasher: PasswordHasherAdapter

    constructor(
        createUserRepository: CreateUserRepository,
        getUserByEmailRepository: GetUserByEmailRepository,
        idGenerator: IdGeneratorAdapter,
        passwordHasher: PasswordHasherAdapter,
    ) {
        this.createUserRepository = createUserRepository
        this.getUserByEmailRepository = getUserByEmailRepository
        this.idGenerator = idGenerator
        this.passwordHasher = passwordHasher
    }

    async execute(
        createUserParams: CreateUserParams,
    ): Promise<UserPublicResponse> {
        const userWithProviderEmail =
            await this.getUserByEmailRepository.execute(createUserParams.email)

        if (userWithProviderEmail) {
            throw new EmailAlreadyExistsError(createUserParams.email)
        }

        const userId = this.idGenerator.execute()

        // criptografdar a senha
        // sendo o "10" o "Salt", que é o nível de criptografia
        const hashPassword = await this.passwordHasher.execute(
            createUserParams.password,
        )

        const user = {
            // dessestruturando o que a gente recebe como parametrp
            ...createUserParams,
            id: userId,
            // e colocando o password no final para ele sobrescrever o que está sendo desestruturado acima
            password: hashPassword,
        }

        const newUser = await this.createUserRepository.execute(user)

        return newUser
    }
}
