import { Router } from 'express'

import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserBalanceController,
    makeGetUserByIdController,
    makeLoginUserController,
    makeRefreshTokenController,
    makeUpdateUserController,
} from '@/factories/controllers/'
import { auth, AuthenticatedRequest } from '@/middlewares/auth'
import { validate } from '@/middlewares/validate'
import {
    createUserSchema,
    deleteUserSchema,
    getUserBalanceSchema,
    getUserByIdSchema,
    loginSchema,
    refreshTokenSchema,
    updateUserSchema,
} from '@/schemas'

export const usersRouter = Router()

// Rota para buscar o usuário logado
usersRouter.get(
    '/me',
    auth,
    validate(getUserByIdSchema),
    async (req: AuthenticatedRequest, res) => {
        const getUserByIdController = makeGetUserByIdController()

        const { statusCode, body } = await getUserByIdController.execute({
            ...req,
            headers: {
                userId: req.userId as string,
            },
        })

        res.status(statusCode).send(body)
    },
)

// Rota para buscar o saldo do usuário logado
usersRouter.get(
    '/me/balance',
    auth,
    validate(getUserBalanceSchema),
    async (req: AuthenticatedRequest, res) => {
        const getUserBalanceController = makeGetUserBalanceController()

        const { statusCode, body } = await getUserBalanceController.execute({
            ...req,
            headers: {
                userId: req.userId as string,
            },
            query: {
                from: req.query.from as string,
                to: req.query.to as string,
            },
        })

        res.status(statusCode).send(body)
    },
)

// Rota para criar um novo usuário
usersRouter.post(
    '/',
    validate(createUserSchema),
    async (req: AuthenticatedRequest, res) => {
        const createUserController = makeCreateUserController()

        const { statusCode, body } = await createUserController.execute(req)

        res.status(statusCode).send(body)
    },
)

// Rota para atualizar um usuário
usersRouter.patch(
    '/me',
    auth,
    validate(updateUserSchema),
    async (req: AuthenticatedRequest, res) => {
        const updateUserController = makeUpdateUserController()

        const { statusCode, body } = await updateUserController.execute({
            ...req,
            headers: {
                userId: req.userId as string,
            },
        })

        res.status(statusCode).send(body)
    },
)

// Rota para deletar um usuário
usersRouter.delete(
    '/me',
    auth,
    validate(deleteUserSchema),
    async (req: AuthenticatedRequest, res) => {
        const deleteUserController = makeDeleteUserController()

        const { statusCode, body } = await deleteUserController.execute({
            ...req,
            headers: {
                userId: req.userId as string,
            },
        })

        res.status(statusCode).send(body)
    },
)

// Rota para fazer login
usersRouter.post(
    '/login',
    validate(loginSchema),
    async (req: AuthenticatedRequest, res) => {
        const loginUserController = makeLoginUserController()

        const { statusCode, body } = await loginUserController.execute(req)

        res.status(statusCode).send(body)
    },
)

usersRouter.post(
    '/refresh-token',
    validate(refreshTokenSchema),
    async (req: AuthenticatedRequest, res) => {
        const refreshTokenController = makeRefreshTokenController()

        const { statusCode, body } = await refreshTokenController.execute(req)

        res.status(statusCode).send(body)
    },
)
