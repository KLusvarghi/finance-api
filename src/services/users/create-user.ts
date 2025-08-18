import { IdGeneratorAdapter, PasswordHasherAdapter } from '@/adapters'
import { EmailAlreadyExistsError } from '@/errors'
import {
    CreateUserParams,
    CreateUserRepository,
    GetUserByEmailRepository,
    Service,
    UserPublicResponse,
} from '@/shared'

// export class CreateUserService
//     implements Service<CreateUserParams, UserPublicResponse>
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

        const { password: _password, ...userWithoutPassword } =
            await this.createUserRepository.execute(user)

        return userWithoutPassword
    }
}
