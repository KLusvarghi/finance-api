import { TokensGeneratorAdapter, TokenVerifierAdapter } from '@/adapters'
import { UnauthorizedError } from '@/errors'

export class RefreshTokenService {
    constructor(
        private readonly TokensGeneratorAdapter: TokensGeneratorAdapter,
        private readonly tokenVerifierAdapter: TokenVerifierAdapter,
    ) {}

    async execute(refreshToken: string) {
        const decodedToken = await this.tokenVerifierAdapter.execute(
            refreshToken,
            process.env.JWT_REFRESH_SECRET as string,
        )

        if (typeof decodedToken !== 'object' || !decodedToken) {
            throw new UnauthorizedError()
        }

        return this.TokensGeneratorAdapter.execute(
            decodedToken.userId as string,
        )
    }
}
