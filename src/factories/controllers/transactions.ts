import { CreateTransactionController } from '@/controllers'
import {
    PostgresGetUserByIdRepository,
    PostgresCreateTransactionRepository,
} from '@/repositories/postgres'
import { CreateTransactionService } from '@/services'

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const createTransactionService = new CreateTransactionService(
        createTransactionRepository,
        getUserByIdRepository,
    )

    const createTransactionController = new CreateTransactionController(
        createTransactionService,
    )

    return createTransactionController
}
