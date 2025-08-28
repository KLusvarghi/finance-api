import jwt from 'jsonwebtoken'

import { UserIdMissingError } from '@/errors'
import { TokenGeneratorAdapterResponse } from '@/shared'

export class TokenGeneratorAdapter {
    async execute(userId: string): Promise<TokenGeneratorAdapterResponse> {
        // Guard clause: validar se userId é válido
        if (!userId || userId.trim() === '') {
            throw new UserIdMissingError()
        }

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
            // Re-throw com contexto mais claro se necessário
            throw new Error(
                `Failed to generate tokens: ${error instanceof Error ? error.message : 'Unknown error'}`,
            )
        }
    }
}
