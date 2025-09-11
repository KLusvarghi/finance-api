import { PasswordComparatorAdapter, TokensGeneratorAdapter } from '@/adapters'
import { LoginFailedError } from '@/errors'
import {
    GetUserByEmailRepository,
    TokensGeneratorAdapterResponse,
    UserRepositoryResponse,
} from '@/shared'

export class AuthenticateUserService {
    constructor(
        private getUserByEmailRepository: GetUserByEmailRepository,
        private passwordComparator: PasswordComparatorAdapter,
        private TokensGeneratorAdapter: TokensGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.passwordComparator = passwordComparator
        this.TokensGeneratorAdapter = TokensGeneratorAdapter
    }
    async execute(
        email: string,
        password: string,
    ): Promise<
        UserRepositoryResponse & { tokens: TokensGeneratorAdapterResponse }
    > {
        // verificar se o e-mail válido (se não houver usuério com esse e-amil lançamos uma exceção)
        const user = await this.getUserByEmailRepository.execute(email)
        if (!user) {
            throw new LoginFailedError()
        }

        // verificar se a senha é válida (se não estiver lançamos uma exceção)
        const isPasswordValid = await this.passwordComparator.execute(
            password,
            user.password,
        )

        if (!isPasswordValid) {
            throw new LoginFailedError()
        }
        // gerar os tokens JWT
        const tokens = await this.TokensGeneratorAdapter.execute(user.id)

        // TODO: validar se o token é gerado e o adapter não lança erro

        // retornar o token JWT
        return {
            ...user,
            tokens,
        }
    }
}
