import { DeleteUserService } from './delete-user';
import { UserNotFoundError } from '@/errors/user';
import { userId, deleteUserServiceResponse, deleteUserRepositoryResponse, } from '@/test';
describe('DeleteUserService', () => {
    let sut;
    let deleteUserRepository;
    class DeleteUserRepositoryStub {
        async execute(_id) {
            return Promise.resolve(deleteUserRepositoryResponse);
        }
    }
    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub();
        const sut = new DeleteUserService(deleteUserRepository);
        return {
            sut,
            deleteUserRepository,
        };
    };
    beforeEach(() => {
        const { sut: service, deleteUserRepository: deleteUserRepositoryStub } = makeSut();
        sut = service;
        deleteUserRepository = deleteUserRepositoryStub;
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });
    describe('error handling', () => {
        it('should return UserNotFoundError if DeleteUserRepository returns null', async () => {
            // arrange
            jest.spyOn(deleteUserRepository, 'execute').mockResolvedValueOnce(null);
            // act
            const promise = sut.execute(userId);
            // assert
            expect(promise).rejects.toThrow(new UserNotFoundError(userId));
        });
        // esse tipo de teste é importnate para garantir que o nosso service não está tratando a excessão do nosso repository e passando para cima para o nosso controller
        it('should throw if DeleteUserRepository throws', async () => {
            // arrange
            jest.spyOn(deleteUserRepository, 'execute').mockRejectedValueOnce(new UserNotFoundError('invalid_user_id'));
            // act
            const promise = sut.execute('invalid_user_id');
            // assert
            expect(promise).rejects.toThrow(new UserNotFoundError('invalid_user_id'));
        });
    });
    describe('success', () => {
        it('should successefully delete an user', async () => {
            // act
            const response = await sut.execute(userId);
            // assert
            expect(response).toBeTruthy();
            expect(response).toEqual(deleteUserServiceResponse);
        });
    });
    describe('validations', () => {
        //  validando se o deleteUserRepository foi chamado com o id correto
        it('should call deleteUserRepository with correct params', async () => {
            // arrange
            const executeSpy = jest.spyOn(deleteUserRepository, 'execute');
            // act
            await sut.execute(userId);
            // assert
            expect(executeSpy).toHaveBeenCalledWith(userId);
            expect(executeSpy).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=delete-user.test.js.map