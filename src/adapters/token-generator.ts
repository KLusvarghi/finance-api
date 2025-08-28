import jwt from 'jsonwebtoken'

import { TokenGeneratorAdapterResponse } from '@/shared'

export class TokenGeneratorAdapter {
    async execute(userId: string): Promise<TokenGeneratorAdapterResponse> {
        return {
            accessToken: jwt.sign(
                // O primeiro parametro é o payload que será assinado
                { userId },
                // O segundo parametro é a chave secreta
                process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
                {
                    // O terceiro parametro é o tempo de expiração
                    expiresIn: '15m',
                },
            ),
            refreshToken: jwt.sign(
                { userId },
                process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
                {
                    expiresIn: '7d',
                },
            ),
        }
    }
}
