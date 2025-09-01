import { PasswordComparatorAdapter, TokenGeneratorAdapter } from '@/adapters'
import { InvalidPasswordError, LoginFailedError } from '@/errors'
import {
    GetUserByEmailRepository,
    TokenGeneratorAdapterResponse,
    UserRepositoryResponse,
} from '@/shared'

export class LoginUserService {
    constructor(
        private getUserByEmailRepository: GetUserByEmailRepository,
        private passwordComparator: PasswordComparatorAdapter,
        private tokenGeneratorAdapter: TokenGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.passwordComparator = passwordComparator
        this.tokenGeneratorAdapter = tokenGeneratorAdapter
    }
    async execute(
        email: string,
        password: string,
    ): Promise<
        UserRepositoryResponse & { tokens: TokenGeneratorAdapterResponse }
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
            throw new InvalidPasswordError()
        }
        // gerar os tokens JWT
        const tokens = await this.tokenGeneratorAdapter.execute(user.id)

        // TODO: validar se o token é gerado e o adapter não lança erro

        // retornar o token JWT
        return {
            ...user,
            tokens,
        }
    }
}
