import { Router } from 'express'

import {
    makeAuthLoginUserController,
    makeAuthRefreshTokenController,
} from '@/factories/controllers'
import { AuthenticatedRequest } from '@/middlewares/auth'
import { validate } from '@/middlewares/validate'
import { loginSchema, refreshTokenSchema } from '@/schemas'

export const authRouter = Router()

// Rota para fazer login
authRouter.post(
    '/login',
    validate(loginSchema),
    async (req: AuthenticatedRequest, res) => {
        const loginUserController = makeAuthLoginUserController()

        const { statusCode, body } = await loginUserController.execute(req)

        res.status(statusCode).send(body)
    },
)

authRouter.post(
    '/refresh-token',
    validate(refreshTokenSchema),
    async (req: AuthenticatedRequest, res) => {
        const refreshTokenController = makeAuthRefreshTokenController()

        const { statusCode, body } = await refreshTokenController.execute(req)

        res.status(statusCode).send(body)
    },
)
