import { Router } from 'express'

import { adaptRoute } from './adapters/express-route-adapter'

import {
    makeAuthLoginUserController,
    makeAuthRefreshTokenController,
} from '@/factories/controllers'
import { validate } from '@/middlewares/validate'
import { loginSchema, refreshTokenSchema } from '@/schemas'

export const authRouter = Router()

// Rota para fazer login
authRouter.post(
    '/login',
    validate(loginSchema),
    adaptRoute(makeAuthLoginUserController()),
)

authRouter.post(
    '/refresh-token',
    validate(refreshTokenSchema),
    adaptRoute(makeAuthRefreshTokenController()),
)
