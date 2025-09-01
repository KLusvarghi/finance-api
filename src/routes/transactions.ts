import { Router } from 'express'

import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
} from '@/factories/controllers'
import { auth, AuthenticatedRequest } from '@/middlewares/auth'

export const transactionsRouter = Router()

// Rota para buscar todas as transações do usuário logado
transactionsRouter.get('/me', auth, async (req: AuthenticatedRequest, res) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController()

    const { statusCode, body } =
        await getTransactionsByUserIdController.execute({
            ...req,
            headers: {
                userId: req.userId as string,
            },
        })

    res.status(statusCode).send(body)
})

// Rota para criar uma nova transação
transactionsRouter.post('/me', auth, async (req: AuthenticatedRequest, res) => {
    const createTransactionController = makeCreateTransactionController()

    const { statusCode, body } = await createTransactionController.execute({
        ...req,
        headers: { userId: req.userId as string },
    })

    res.status(statusCode).send(body)
})

// Rota para atualizar uma transação
transactionsRouter.patch(
    '/:transactionId',
    auth,
    async (req: AuthenticatedRequest, res) => {
        const updateTransactionsController = makeUpdateTransactionController()

        const { statusCode, body } = await updateTransactionsController.execute(
            {
                body: req.body,
                params: { transactionId: req.params.transactionId as string },
                headers: { userId: req.userId as string },
            },
        )

        res.status(statusCode).send(body)
    },
)

// Rota para deletar uma transação
transactionsRouter.delete(
    '/:transactionId',
    auth,
    async (req: AuthenticatedRequest, res) => {
        const deleteTransactionsController = makeDeleteTransactionController()

        const { statusCode, body } = await deleteTransactionsController.execute(
            {
                params: {
                    transactionId: req.params.transactionId,
                },
                headers: { userId: req.userId as string },
            },
        )

        res.status(statusCode).send(body)
    },
)
