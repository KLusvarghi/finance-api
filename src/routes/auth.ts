import { Router } from 'express'

import { adaptRoute } from './adapters/express-route-adapter'

import {
    makeAuthLoginUserController,
    makeAuthRefreshTokenController,
} from '@/factories/controllers'
import { rateLimiter } from '@/middlewares/rate-limiter'
import { validate } from '@/middlewares/validate'
import { loginSchema, refreshTokenSchema } from '@/schemas'

export const authRouter = Router()

// Rota para fazer login
authRouter.post(
    '/login',
    rateLimiter('strict'),
    validate(loginSchema),
    adaptRoute(makeAuthLoginUserController()),
)

authRouter.post(
    '/refresh-token',
    validate(refreshTokenSchema),
    adaptRoute(makeAuthRefreshTokenController()),
)
