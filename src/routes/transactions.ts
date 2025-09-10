import { Router } from 'express'

import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
} from '@/factories/controllers'
import { auth, AuthenticatedRequest } from '@/middlewares/auth'
import { validate } from '@/middlewares/validate'
import {
    createTransactionSchema,
    deleteTransactionSchema,
    getTransactionsByUserIdSchema,
    updateTransactionSchema,
} from '@/schemas'
import { ResponseMessage } from '@/shared'

export const transactionsRouter = Router()

// Rota para buscar todas as transações do usuário logado
transactionsRouter.get(
    '/me',
    auth,
    validate(getTransactionsByUserIdSchema),
    async (req: AuthenticatedRequest, res) => {
        const getTransactionsByUserIdController =
            makeGetTransactionsByUserIdController()

        const { statusCode, body } =
            await getTransactionsByUserIdController.execute({
                ...req,
                query: {
                    from: req.query.from as string,
                    to: req.query.to as string,
                },
                headers: {
                    userId: req.userId as string,
                },
            })

        res.status(statusCode).send(body)
    },
)

// Rota para criar uma nova transação
transactionsRouter.post(
    '/me',
    auth,
    validate(createTransactionSchema),
    async (req: AuthenticatedRequest, res) => {
        const createTransactionController = makeCreateTransactionController()

        const { statusCode, body } = await createTransactionController.execute({
            ...req,
            headers: { userId: req.userId as string },
        })

        res.status(statusCode).send(body)
    },
)

// Rota para lidar com transactionId ausente - deve vir ANTES da rota com parâmetro
transactionsRouter.patch('/me/', auth, (req: AuthenticatedRequest, res) => {
    res.status(400).json({
        success: false,
        message: ResponseMessage.TRANSACTION_ID_MISSING,
        code: 'TRANSACTION_ID_MISSING',
    })
})

// Rota para atualizar uma transação
transactionsRouter.patch(
    '/me/:transactionId',
    auth,
    validate(updateTransactionSchema),
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

// Rota para lidar com transactionId ausente no DELETE - deve vir ANTES da rota com parâmetro
transactionsRouter.delete('/me/', auth, (req: AuthenticatedRequest, res) => {
    res.status(400).json({
        success: false,
        message: ResponseMessage.TRANSACTION_ID_MISSING,
        code: 'TRANSACTION_ID_MISSING',
    })
})

// Rota para deletar uma transação
transactionsRouter.delete(
    '/me/:transactionId',
    auth,
    validate(deleteTransactionSchema),
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
