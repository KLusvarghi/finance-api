import { IdGeneratorAdapter, PasswordHasherAdapter } from '@/adapters';
import { CreateUserController, DeleteUserController, GetUserBalanceController, GetUserByIdController, UpdateUserController, } from '@/controllers';
import { PostgresCreateUserRepository, PostgresDeleteUserRepository, PostgresGetUserBalanceRepository, PostgresGetUserByEmailRepository, PostgresGetUserByIdRepository, PostgresUpdateUserRepository, } from '@/repositories/postgres';
import { CreateUserService, DeleteUserService, GetUserBalanceService, GetUserByIdService, UpdateUserService, } from '@/services';
export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository();
    const getUserByIdService = new GetUserByIdService(getUserByIdRepository);
    const getUserByIdController = new GetUserByIdController(getUserByIdService);
    return getUserByIdController;
};
export const makeCreateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
    const createUserRepository = new PostgresCreateUserRepository();
    const idGenerator = new IdGeneratorAdapter();
    const passwordHasher = new PasswordHasherAdapter();
    const createUserService = new CreateUserService(createUserRepository, getUserByEmailRepository, idGenerator, passwordHasher);
    const createUserController = new CreateUserController(createUserService);
    return createUserController;
};
export const makeUpdateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
    const updateUserRepository = new PostgresUpdateUserRepository();
    const getUserByIdRepository = new PostgresGetUserByIdRepository();
    const passwordHasher = new PasswordHasherAdapter();
    const updateUserService = new UpdateUserService(getUserByEmailRepository, updateUserRepository, passwordHasher, getUserByIdRepository);
    const updateUserController = new UpdateUserController(updateUserService);
    return updateUserController;
};
export const makeDeleteUserController = () => {
    const deletedUserRepository = new PostgresDeleteUserRepository();
    const deleteUserService = new DeleteUserService(deletedUserRepository);
    const deleteUserController = new DeleteUserController(deleteUserService);
    return deleteUserController;
};
export const makeGetUserBalanceController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository();
    const getUserBalanceRepository = new PostgresGetUserBalanceRepository();
    const getUserBalanceService = new GetUserBalanceService(getUserByIdRepository, getUserBalanceRepository);
    const getUserBalanceController = new GetUserBalanceController(getUserBalanceService);
    return getUserBalanceController;
};
//# sourceMappingURL=user.js.map