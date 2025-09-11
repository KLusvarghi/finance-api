import { Response, Router } from 'express'

import { adaptRoute } from './adapters/express-route-adapter'

import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
} from '@/factories/controllers'
import { auth } from '@/middlewares/auth'
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
    adaptRoute(makeGetTransactionsByUserIdController()),
)

// Rota para criar uma nova transação
transactionsRouter.post(
    '/me',
    auth,
    validate(createTransactionSchema),
    adaptRoute(makeCreateTransactionController()),
)

// TODO: ver se é necessário
// Rota para lidar com transactionId ausente - deve vir ANTES da rota com parâmetro
transactionsRouter.patch('/me/', auth, (res: Response) => {
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
    adaptRoute(makeUpdateTransactionController()),
)

// TODO: ver se é necessário
// Rota para lidar com transactionId ausente no DELETE - deve vir ANTES da rota com parâmetro
transactionsRouter.delete('/me/', auth, (res: Response) => {
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
    adaptRoute(makeDeleteTransactionController()),
)
