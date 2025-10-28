import { PasswordComparatorAdapter } from '@/adapters'
import { TokensGeneratorAdapter } from '@/adapters'
import { TokenVerifierAdapter } from '@/adapters'
import {
    AuthenticateUserController,
    RefreshTokenController,
} from '@/controllers'
import { PostgresGetUserByEmailRepository } from '@/repositories/postgres'
import { AuthenticateUserService } from '@/services'
import { RefreshTokenService } from '@/services'

// Rota para fazer login
export const makeAuthLoginUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const passwordComparator = new PasswordComparatorAdapter()
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()

    const authenticateUserService = new AuthenticateUserService(
        getUserByEmailRepository,
        passwordComparator,
        tokensGeneratorAdapter,
    )

    const authenticateUserController = new AuthenticateUserController(
        authenticateUserService,
    )

    return authenticateUserController
}

// Rota para atualizar o tokens
export const makeAuthRefreshTokenController = () => {
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()
    const tokenVerifierAdapter = new TokenVerifierAdapter()
    const refreshTokenService = new RefreshTokenService(
        tokensGeneratorAdapter,
        tokenVerifierAdapter,
    )
    const refreshTokenController = new RefreshTokenController(
        refreshTokenService,
    )

    return refreshTokenController
}
