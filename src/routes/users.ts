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

export const usersRouter = Router()

// Rota para buscar o usuário logado
usersRouter.get('/me', auth, async (req: AuthenticatedRequest, res) => {
    const getUserByIdController = makeGetUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute({
        ...req,
        headers: {
            userId: req.userId as string,
        },
    })

    res.status(statusCode).send(body)
})

// Rota para buscar o saldo do usuário logado
usersRouter.get('/me/balance', auth, async (req: AuthenticatedRequest, res) => {
    const getUserBalanceController = makeGetUserBalanceController()

    const { statusCode, body } = await getUserBalanceController.execute({
        ...req,
        headers: {
            userId: req.userId as string,
        },
    })

    res.status(statusCode).send(body)
})

// Rota para criar um novo usuário
usersRouter.post('/', async (req: AuthenticatedRequest, res) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).send(body)
})

// Rota para atualizar um usuário
usersRouter.patch('/me', auth, async (req: AuthenticatedRequest, res) => {
    const updateUserController = makeUpdateUserController()

    const { statusCode, body } = await updateUserController.execute({
        ...req,
        headers: {
            userId: req.userId as string,
        },
    })

    res.status(statusCode).send(body)
})

// Rota para deletar um usuário
usersRouter.delete('/:userId', auth, async (req: AuthenticatedRequest, res) => {
    const deleteUserController = makeDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute({
        ...req,
        headers: {
            userId: req.userId as string,
        },
    })

    res.status(statusCode).send(body)
})

// Rota para fazer login
usersRouter.post('/login', async (req: AuthenticatedRequest, res) => {
    const loginUserController = makeLoginUserController()

    const { statusCode, body } = await loginUserController.execute(req)

    res.status(statusCode).send(body)
})

usersRouter.post('/refresh-token', async (req: AuthenticatedRequest, res) => {
    const refreshTokenController = makeRefreshTokenController()

    const { statusCode, body } = await refreshTokenController.execute(req)

    res.status(statusCode).send(body)
})
