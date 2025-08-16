import { UpdateUserService } from './update-user';
import { EmailAlreadyExistsError, UpdateUserFailedError, UserNotFoundError, } from '@/errors/user';
import { userId, updateUserParams, updateUserServiceResponse, updateUserRepositoryResponse, } from '@/test';
describe('UpdateUserService', () => {
    let sut;
    let updateUserRepository;
    let getUserByEmailRepository;
    let getUserByIdRepository;
    let passwordHasherAdapter;
    class UpdateUserRepositoryStub {
        async execute(_userId, _updateUserParams) {
            return Promise.resolve(updateUserRepositoryResponse);
        }
    }
    class GetUserByIdRepositoryStub {
        async execute(_userId) {
            return Promise.resolve(updateUserRepositoryResponse);
        }
    }
    class GetUserByEmailRepositoryStub {
        async execute(_email) {
            return Promise.resolve(null);
        }
    }
    class PasswordHasherAdapterStub {
        async execute(_password) {
            return Promise.resolve(updateUserRepositoryResponse.password);
        }
    }
    const makeSut = () => {
        const updateUserRepository = new UpdateUserRepositoryStub();
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const passwordHasherAdapter = new PasswordHasherAdapterStub();
        const sut = new UpdateUserService(getUserByEmailRepository, updateUserRepository, passwordHasherAdapter, getUserByIdRepository);
        return {
            sut,
            updateUserRepository,
            getUserByEmailRepository,
            getUserByIdRepository,
            passwordHasherAdapter,
        };
    };
    beforeEach(() => {
        const { sut: service, updateUserRepository: updateUserRepositoryStub, getUserByEmailRepository: getUserByEmailRepositoryStub, getUserByIdRepository: getUserByIdRepositoryStub, passwordHasherAdapter: passwordHasherAdapterStub, } = makeSut();
        sut = service;
        updateUserRepository = updateUserRepositoryStub;
        getUserByEmailRepository = getUserByEmailRepositoryStub;
        getUserByIdRepository = getUserByIdRepositoryStub;
        passwordHasherAdapter = passwordHasherAdapterStub;
    });
    describe('error handling', () => {
        it('should throw UpdateUserFailedError if UpdateUserRepository throws', async () => {
            // arrange
            jest.spyOn(updateUserRepository, 'execute').mockResolvedValueOnce(null);
            // act
            const promise = sut.execute(userId, updateUserParams);
            // assert
            expect(promise).rejects.toThrow(new UpdateUserFailedError());
        });
        it('should throw EmailAlreadyExistsError if email already exists', () => {
            // arrange
            // mockamos o retorno para que o email já exista e ele entre no if do service
            jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(updateUserRepositoryResponse);
            // act
            // não passamos o await para que ele retorne uma promise e não um valor
            // passando um id diferente do que é passado no "updateUserRepositoryResponse" para que ele entre no outro if do service e retorne o erro
            const promise = sut.execute('different-user-id', {
                email: updateUserServiceResponse.email,
            });
            // assert
            expect(promise).rejects.toThrow(new EmailAlreadyExistsError(updateUserServiceResponse.email));
        });
        it('should throw UserNotFoundError if GetUserByIdRepository throws', async () => {
            // arrange
            jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null);
            // act
            const promise = sut.execute(userId, {
                email: 'different-email@example.com',
            });
            // assert
            expect(promise).rejects.toThrow();
            expect(promise).rejects.toThrow(new UserNotFoundError(userId));
        });
        it('should throw if PasswordHasherAdapter throws', async () => {
            // arrange
            jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(new Error());
            // act
            const promise = sut.execute(userId, {
                password: 'different-password',
            });
            // assert
            expect(promise).rejects.toThrow();
        });
        it('should throw if UpdateUserRepository throws', async () => {
            // arrange
            jest.spyOn(updateUserRepository, 'execute').mockRejectedValueOnce(new Error());
            // act
            const promise = sut.execute(userId, updateUserParams);
            // assert
            expect(promise).rejects.toThrow();
        });
    });
    describe('success', () => {
        it('should successfully update a user (without password and email)', async () => {
            // act
            const response = await sut.execute(userId, updateUserParams);
            // assert
            expect(response).toEqual(updateUserServiceResponse);
        });
        it('should successfully update a user (with email)', async () => {
            // arrange
            const getUserByEmailRepositorySpy = jest.spyOn(getUserByEmailRepository, 'execute');
            // act
            const response = await sut.execute(userId, {
                email: updateUserServiceResponse.email,
            });
            // assert
            expect(response).toEqual(updateUserServiceResponse);
            // para garantir que o repository seja chamado com o email que estamos passando no service:
            expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(updateUserServiceResponse.email);
        });
        it('should successfully update a user (with password)', async () => {
            // arrange
            const passwordHasherAdapterSpy = jest.spyOn(passwordHasherAdapter, 'execute');
            // act
            const response = await sut.execute(userId, {
                password: updateUserParams.password,
            });
            // assert
            expect(response).toEqual(updateUserServiceResponse);
            // para garantir que o repository seja chamado com o email que estamos passando no service:
            expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(updateUserParams.password);
        });
        describe('validations', () => {
            it('should call UpdateUserRepository with correct params', async () => {
                // arrange
                const executeSpy = jest.spyOn(updateUserRepository, 'execute');
                // act
                await sut.execute(userId, updateUserParams);
                // assert
                // O serviço deve fazer hash da senha antes de chamar o repository
                const expectedParams = {
                    ...updateUserParams,
                    password: 'valid_hash', // Senha já com hash
                };
                expect(executeSpy).toHaveBeenCalledWith(userId, expectedParams);
                expect(executeSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
//# sourceMappingURL=update-user.test.js.map