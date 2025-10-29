import { PasswordComparatorAdapter, TokensGeneratorAdapter } from '@/adapters'
import { LoginFailedError } from '@/errors'
import { GetUserByEmailRepository } from '@/repositories/postgres'
import { AuthenticatedUserResponse } from '@/shared'

export class AuthenticateUserService {
    constructor(
        private readonly getUserByEmailRepository: GetUserByEmailRepository,
        private readonly passwordComparator: PasswordComparatorAdapter,
        private readonly TokensGeneratorAdapter: TokensGeneratorAdapter,
    ) {}
    async execute(
        email: string,
        password: string,
    ): Promise<AuthenticatedUserResponse> {
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
