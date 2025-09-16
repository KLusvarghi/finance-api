import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

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
            if (error instanceof TokenExpiredError) {
                throw new ExpiredTokenError()
            }
            if (error instanceof JsonWebTokenError) {
                throw new InvalidTokenError()
            }
            throw new InvalidTokenError()
        }
    }
}
