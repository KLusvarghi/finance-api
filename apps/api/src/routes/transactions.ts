import { Router } from 'express'

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

import { adaptRoute } from './adapters/express-route-adapter'

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

// Rota para atualizar uma transação
transactionsRouter.patch(
    '/me/:transactionId',
    auth,
    validate(updateTransactionSchema),
    adaptRoute(makeUpdateTransactionController()),
)

// Rota para deletar uma transação
transactionsRouter.delete(
    '/me/:transactionId',
    auth,
    validate(deleteTransactionSchema),
    adaptRoute(makeDeleteTransactionController()),
)
