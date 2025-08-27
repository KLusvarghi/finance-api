import { Router } from 'express'
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
} from '@/factories/controllers'
export const transactionsRouter = Router()
transactionsRouter.get('/', async (request, response) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController()
    const { statusCode, body } =
        await getTransactionsByUserIdController.execute(request)
    response.status(statusCode).send(body)
})
transactionsRouter.post('/', async (request, response) => {
    const createTransactionController = makeCreateTransactionController()
    const { statusCode, body } =
        await createTransactionController.execute(request)
    response.status(statusCode).send(body)
})
transactionsRouter.patch('/:transactionId', async (request, response) => {
    const updateTransactionsController = makeUpdateTransactionController()
    const { statusCode, body } =
        await updateTransactionsController.execute(request)
    response.status(statusCode).send(body)
})
transactionsRouter.delete('/:transactionId', async (request, response) => {
    const deleteTransactionsController = makeDeleteTransactionController()
    const { statusCode, body } =
        await deleteTransactionsController.execute(request)
    response.status(statusCode).send(body)
})
//# sourceMappingURL=transactions.js.map
