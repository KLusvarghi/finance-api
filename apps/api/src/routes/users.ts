import { Router } from 'express'

import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserBalanceController,
    makeGetUserByIdController,
    makeUpdateUserController,
} from '@/factories/controllers/'
import { auth } from '@/middlewares/auth'
import { rateLimiter } from '@/middlewares/rate-limiter'
import { validate } from '@/middlewares/validate'
import {
    createUserSchema,
    deleteUserSchema,
    getUserBalanceSchema,
    getUserByIdSchema,
    updateUserSchema,
} from '@/schemas'

import { adaptRoute } from './adapters/express-route-adapter'

export const usersRouter = Router()

// Rota para buscar o usuário logado
usersRouter.get(
    '/me',
    auth,
    validate(getUserByIdSchema),
    adaptRoute(makeGetUserByIdController()),
)

// Rota para buscar o saldo do usuário logado
usersRouter.get(
    '/me/balance',
    auth,
    validate(getUserBalanceSchema),
    adaptRoute(makeGetUserBalanceController()),
)

// Rota para criar um novo usuário
usersRouter.post(
    '/',
    rateLimiter('public'),
    validate(createUserSchema),
    adaptRoute(makeCreateUserController()),
)

// Rota para atualizar um usuário
usersRouter.patch(
    '/me',
    auth,
    validate(updateUserSchema),
    adaptRoute(makeUpdateUserController()),
)

// Rota para deletar um usuário
usersRouter.delete(
    '/me',
    auth,
    validate(deleteUserSchema),
    adaptRoute(makeDeleteUserController()),
)
