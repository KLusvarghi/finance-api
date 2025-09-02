import jwt from 'jsonwebtoken'

export class TokenVerifierAdapter {
    async execute(
        token: string,
        secret: string,
    ): Promise<string | jwt.JwtPayload> {
        return jwt.verify(token, secret)
    }
}
