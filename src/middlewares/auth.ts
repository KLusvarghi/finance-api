import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

/**
 * Extends Express `Request` to ensure the `authorization` header
 * is recognised by the TypeScript compiler.
 */
export interface AuthenticatedRequest extends Request {
    headers: Request['headers'] & {
        authorization?: string
    }
    userId?: string
}

export const auth = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        // pego o token de acesso do header
        const accessToken = req.headers.authorization?.split('Bearer ')[1]

        // No header → 401
        if (!accessToken) {
            return res.status(401).send({ message: 'Unauthorized' })
        }

        // se o token não for válido, ele vai lançar um erro e tratamos no catch
        jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string)

        // se ele for válido, ele retorna o payload
        const payload = jwt.decode(accessToken) as { userId: string }

        req.userId = payload?.userId

        // Token is valid → continue
        next()
    } catch (error) {
        console.error(error)
        // Invalid/expired token or verification error
        return res.status(401).send({ message: 'Unauthorized' })
    }
}
