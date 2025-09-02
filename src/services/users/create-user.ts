import {
    IdGeneratorAdapter,
    PasswordHasherAdapter,
    TokensGeneratorAdapter,
} from '@/adapters'
import { EmailAlreadyExistsError } from '@/errors'
import {
    CreateUserParams,
    CreateUserRepository,
    GetUserByEmailRepository,
    Service,
    TokensGeneratorAdapterResponse,
    UserPublicResponse,
} from '@/shared'

export class CreateUserService
    implements
        Service<
            CreateUserParams,
            UserPublicResponse & { tokens: TokensGeneratorAdapterResponse }
        >
{
    constructor(
        private readonly createUserRepository: CreateUserRepository,
        private readonly getUserByEmailRepository: GetUserByEmailRepository,
        private readonly idGenerator: IdGeneratorAdapter,
        private readonly passwordHasher: PasswordHasherAdapter,
        private readonly TokensGeneratorAdapter: TokensGeneratorAdapter,
    ) {
        this.createUserRepository = createUserRepository
        this.getUserByEmailRepository = getUserByEmailRepository
        this.idGenerator = idGenerator
        this.passwordHasher = passwordHasher
        this.TokensGeneratorAdapter = TokensGeneratorAdapter
    }

    async execute(
        createUserParams: CreateUserParams,
    ): Promise<
        UserPublicResponse & { tokens: TokensGeneratorAdapterResponse }
    > {
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
        // eslint-disable-next-line
        const { password: _password, ...userWithoutPassword } =
            await this.createUserRepository.execute(user)

        const tokens = await this.TokensGeneratorAdapter.execute(user.id)

        return {
            ...userWithoutPassword,
            tokens,
        }
    }
}
