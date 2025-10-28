import jwt from 'jsonwebtoken'

import { TokenGenerationError } from '@/errors'
import { TokensGeneratorAdapterResponse } from '@/shared'

export class TokensGeneratorAdapter {
    async execute(userId: string): Promise<TokensGeneratorAdapterResponse> {
        try {
            return {
                accessToken: jwt.sign(
                    { userId },
                    process.env.JWT_ACCESS_SECRET as string,
                    {
                        expiresIn: '15m',
                    },
                ),
                refreshToken: jwt.sign(
                    { userId },
                    process.env.JWT_REFRESH_SECRET as string,
                    {
                        expiresIn: '7d',
                    },
                ),
            }
        } catch (error: unknown) {
            console.error('Token generation failed:', error)
            throw new TokenGenerationError()
        }
    }
}
