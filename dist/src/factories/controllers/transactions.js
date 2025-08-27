import { IdGeneratorAdapter } from '@/adapters'
import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionsByUserIdController,
    UpdateTransactionController,
} from '@/controllers'
import {
    PostgresCreateTransactionRepository,
    PostgresDeleteTransactionRepository,
    PostgresGetTransactionByIdRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateTransactionRepository,
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
    const idGenerator = new IdGeneratorAdapter()
    const createTransactionService = new CreateTransactionService(
        createTransactionRepository,
        getUserByIdRepository,
        idGenerator,
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
    const getTransactionByIdRepository =
        new PostgresGetTransactionByIdRepository()
    const updateTransactionService = new UpdateTransactionService(
        updateTransactionRepository,
        getTransactionByIdRepository,
    )
    const updateTransactionController = new UpdateTransactionController(
        updateTransactionService,
    )
    return updateTransactionController
}
export const makeDeleteTransactionController = () => {
    const deleteTransactionRepository =
        new PostgresDeleteTransactionRepository()
    const getTransactionByIdRepository =
        new PostgresGetTransactionByIdRepository()
    const deleteTransactionService = new DeleteTransactionService(
        deleteTransactionRepository,
        getTransactionByIdRepository,
    )
    const deleteTransactionController = new DeleteTransactionController(
        deleteTransactionService,
    )
    return deleteTransactionController
}
//# sourceMappingURL=transactions.js.map
