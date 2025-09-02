import {
    IdGeneratorAdapter,
    PasswordComparatorAdapter,
    PasswordHasherAdapter,
    TokensGeneratorAdapter,
    TokenVerifierAdapter,
} from '@/adapters'
import {
    CreateUserController,
    DeleteUserController,
    GetUserBalanceController,
    GetUserByIdController,
    LoginUserController,
    RefreshTokenController,
    UpdateUserController,
} from '@/controllers'
import {
    PostgresCreateUserRepository,
    PostgresDeleteUserRepository,
    PostgresGetUserBalanceRepository,
    PostgresGetUserByEmailRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository,
} from '@/repositories/postgres'
import {
    CreateUserService,
    DeleteUserService,
    GetUserBalanceService,
    GetUserByIdService,
    LoginUserService,
    RefreshTokenService,
    UpdateUserService,
} from '@/services'

export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserByIdService = new GetUserByIdService(getUserByIdRepository)
    const getUserByIdController = new GetUserByIdController(getUserByIdService)

    return getUserByIdController
}

export const makeCreateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const createUserRepository = new PostgresCreateUserRepository()
    const idGenerator = new IdGeneratorAdapter()
    const passwordHasher = new PasswordHasherAdapter()
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()
    const createUserService = new CreateUserService(
        createUserRepository,
        getUserByEmailRepository,
        idGenerator,
        passwordHasher,
        tokensGeneratorAdapter,
    )
    const createUserController = new CreateUserController(createUserService)

    return createUserController
}

export const makeUpdateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const updateUserRepository = new PostgresUpdateUserRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const passwordHasher = new PasswordHasherAdapter()
    const updateUserService = new UpdateUserService(
        getUserByEmailRepository,
        updateUserRepository,
        passwordHasher,
        getUserByIdRepository,
    )
    const updateUserController = new UpdateUserController(updateUserService)

    return updateUserController
}

export const makeDeleteUserController = () => {
    const deletedUserRepository = new PostgresDeleteUserRepository()
    const deleteUserService = new DeleteUserService(deletedUserRepository)
    const deleteUserController = new DeleteUserController(deleteUserService)

    return deleteUserController
}

export const makeGetUserBalanceController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const getUserBalanceRepository = new PostgresGetUserBalanceRepository()

    const getUserBalanceService = new GetUserBalanceService(
        getUserByIdRepository,
        getUserBalanceRepository,
    )

    const getUserBalanceController = new GetUserBalanceController(
        getUserBalanceService,
    )

    return getUserBalanceController
}

export const makeLoginUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const passwordComparator = new PasswordComparatorAdapter()
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()

    const loginUserService = new LoginUserService(
        getUserByEmailRepository,
        passwordComparator,
        tokensGeneratorAdapter,
    )

    const loginUserController = new LoginUserController(loginUserService)

    return loginUserController
}

export const makeRefreshTokenController = () => {
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()
    const tokenVerifierAdapter = new TokenVerifierAdapter()
    const refreshTokenService = new RefreshTokenService(
        tokensGeneratorAdapter,
        tokenVerifierAdapter,
    )
    const refreshTokenController = new RefreshTokenController(
        refreshTokenService,
    )

    return refreshTokenController
}
