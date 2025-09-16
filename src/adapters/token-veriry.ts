import jwt from 'jsonwebtoken'

import { ExpiredTokenError, InvalidTokenError } from '@/errors'

export class TokenVerifierAdapter {
    async execute(
        token: string,
        secret: string,
    ): Promise<string | jwt.JwtPayload> {
        try {
            return jwt.verify(token, secret)
        } catch (error) {
            console.error('Token verification failed:', error)
            if (error instanceof Error) {
                if (error.name === 'TokenExpiredError') {
                    throw new ExpiredTokenError()
                }
                if (error.name === 'JsonWebTokenError') {
                    throw new InvalidTokenError()
                }
            }
            throw new InvalidTokenError()
        }
    }
}
