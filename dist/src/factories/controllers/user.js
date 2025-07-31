import { CreateUserController, DeleteUserController, GetUserByIdController, UpdateUserController, } from '@/controllers';
import { PostgresCreateUserRepository, PostgresDeleteUserRepository, PostgresGetUserByEmailRepository, PostgresGetUserByIdRepository, PostgresUpdateUserRepository, } from '@/repositories/postgres';
import { CreateUserService, DeleteUserService, GetUserByIdService, UpdateUserService, } from '@/services';
export const makeGetUserByIdController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository();
    const getUserByIdService = new GetUserByIdService(getUserByIdRepository);
    const getUserByIdController = new GetUserByIdController(getUserByIdService);
    return getUserByIdController;
};
export const makeCreateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
    const createUserRepository = new PostgresCreateUserRepository();
    const createUserService = new CreateUserService(createUserRepository, getUserByEmailRepository);
    const createUserController = new CreateUserController(createUserService);
    return createUserController;
};
export const makeUpdateUserController = () => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
    const updateUserRepository = new PostgresUpdateUserRepository();
    const updateUserService = new UpdateUserService(getUserByEmailRepository, updateUserRepository);
    const updateUserController = new UpdateUserController(updateUserService);
    return updateUserController;
};
export const makeDeleteUserController = () => {
    const deletedUserRepository = new PostgresDeleteUserRepository();
    const deleteUserService = new DeleteUserService(deletedUserRepository);
    const deleteUserController = new DeleteUserController(deleteUserService);
    return deleteUserController;
};
