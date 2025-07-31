import {
    CreateTransactionController,
    GetTransactionsByUserIdController,
} from '@/controllers'
import {
    PostgresGetUserByIdRepository,
    PostgresCreateTransactionRepository,
    PostgresGetTransactionsByUserIdRepository,
} from '@/repositories/postgres'
import {
    CreateTransactionService,
    GetTransactionsByUserIdService,
} from '@/services'

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

export const makeGetTransactionsByUserIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getTransactionsByUserIdRepository =
        new PostgresGetTransactionsByUserIdRepository()

    const getTransactionsByUserIdService = new GetTransactionsByUserIdService(
      getUserByIdRepository,
      getTransactionsByUserIdRepository,
    )

    const getTransactionsByUserIdController =
        new GetTransactionsByUserIdController(getTransactionsByUserIdService)

    return getTransactionsByUserIdController
}
