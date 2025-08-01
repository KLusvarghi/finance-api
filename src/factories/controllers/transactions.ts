import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionsByUserIdController,
    UpdateTransactionController,
} from '@/controllers'
import {
    PostgresGetUserByIdRepository,
    PostgresCreateTransactionRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresUpdateTransactionRepository,
    PostgresDeleteTransactionRepository,
} from '@/repositories/postgres'
import {
    CreateTransactionService,
    DeleteTransactionService,
    GetTransactionsByUserIdService,
    UpdateTransactionService,
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

export const makeUpdateTransactionController = () => {
    const updateTransactionRepository =
        new PostgresUpdateTransactionRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const updateTransactionService = new UpdateTransactionService(
        updateTransactionRepository,
        getUserByIdRepository,
    )

    const updateTransactionController = new UpdateTransactionController(
        updateTransactionService,
    )

    return updateTransactionController
}

export const makeDeleteTransactionController = () => {
    const deleteTransactionRepository =
        new PostgresDeleteTransactionRepository()

    const deleteTransactionService = new DeleteTransactionService(
        deleteTransactionRepository,
    )

    const deleteTransactionController = new DeleteTransactionController(
        deleteTransactionService,
    )

    return deleteTransactionController
}
