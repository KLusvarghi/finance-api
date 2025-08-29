import jwt from 'jsonwebtoken'

import { TokenGenerationError } from '@/errors'
import { TokenGeneratorAdapterResponse } from '@/shared'

export class TokenGeneratorAdapter {
    async execute(userId: string): Promise<TokenGeneratorAdapterResponse> {
        // Guard clause: validar se userId é válido
        // if (!userId || userId.trim() === '') {
        //     throw new UserIdMissingError()
        // }

        try {
            return {
                accessToken: jwt.sign(
                    { userId },
                    process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string,
                    {
                        expiresIn: '15m',
                    },
                ),
                refreshToken: jwt.sign(
                    { userId },
                    process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string,
                    {
                        expiresIn: '7d',
                    },
                ),
            }
        } catch (error: unknown) {
            // if (error instanceof jwt.JsonWebTokenError) {
            //     throw new TokenGenerationError(
            //         'Invalid JWT configuration or malformed token',
            //         error,
            //         'JWT_CONFIGURATION_ERROR',
            //     )
            // }

            // if (error instanceof jwt.TokenExpiredError) {
            //     throw new TokenGenerationError(
            //         'Token has expired',
            //         error,
            //         'TOKEN_EXPIRED',
            //     )
            // }

            // if (error instanceof jwt.TokenExpiredError) {
            //     throw new TokenGenerationError(
            //         'Token not yet valid',
            //         error,
            //         'TOKEN_NOT_VALID_YET',
            //     )
            // }

            // Erro genérico para outros casos
            throw new TokenGenerationError(
                'Failed to generate authentication tokens',
                error instanceof Error ? error : undefined,
                'UNKNOWN_TOKEN_ERROR',
            )
        }
    }
}
