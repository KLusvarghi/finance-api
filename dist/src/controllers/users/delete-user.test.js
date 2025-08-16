import { DeleteUserController } from './delete-user';
import { UserNotFoundError } from '@/errors/user';
import { userId, deleteUserRepositoryResponse, deleteUserHttpRequest as baseHttpRequest, invalidUUID, } from '@/test';
describe('DeleteUserController', () => {
    let sut;
    let deleteUserService;
    class DeleteUserServiceStub {
        execute(_userId) {
            return Promise.resolve(deleteUserRepositoryResponse);
        }
    }
    const makeSut = () => {
        const deleteUserService = new DeleteUserServiceStub();
        const sut = new DeleteUserController(deleteUserService);
        return { deleteUserService, sut };
    };
    beforeEach(() => {
        // Setup executado antes de cada teste
        const { sut: controller, deleteUserService: service } = makeSut();
        sut = controller;
        deleteUserService = service;
    });
    afterEach(() => {
        // Limpeza após cada teste
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe('error handling', () => {
        it('should return 404 if user is not found', async () => {
            jest.spyOn(deleteUserService, 'execute').mockImplementationOnce(async () => {
                throw new UserNotFoundError(userId);
            });
            const result = await sut.execute(baseHttpRequest);
            expect(result.statusCode).toBe(404);
            expect(result.body?.status).toBe('error');
            expect(result.body?.message).toBeTruthy();
        });
        it('should return 500 if DeleteUserService throws', async () => {
            jest.spyOn(deleteUserService, 'execute').mockRejectedValueOnce(() => {
                new Error();
            });
            const result = await sut.execute(baseHttpRequest);
            expect(result.statusCode).toBe(500);
            expect(result.body?.status).toBe('error');
            expect(result.body?.message).toBeTruthy();
        });
    });
    describe('validations', () => {
        describe('userId', () => {
            it('should return 400 if userId is not provided', async () => {
                const result = await sut.execute({
                    params: { userId: undefined },
                });
                expect(result.statusCode).toBe(400);
                expect(result.body?.status).toBe('error');
                expect(result.body?.message).toBeTruthy();
                expect(result.body?.message).toBe('Missing param: userId');
            });
            it.each(invalidUUID)('should return 400 if userId is $description', async ({ id }) => {
                // arrange
                const result = await sut.execute({
                    params: { userId: id },
                });
                // assert
                expect(result.statusCode).toBe(400);
                expect(result.body?.status).toBe('error');
                expect(result.body?.message).toBe('The provider id is not valid.');
            });
        });
    });
    describe('success cases', () => {
        it('should return 200 if user is deleted successfully', async () => {
            const result = await sut.execute(baseHttpRequest);
            expect(result.statusCode).toBe(200);
            expect(result.body?.status).toBe('success');
            expect(result.body?.message).toBeTruthy();
            expect(result.body?.data).toEqual(deleteUserRepositoryResponse);
        });
        it('should call DeleteUserService with correct parameters', async () => {
            // arrange
            const spy = jest.spyOn(deleteUserService, 'execute');
            // act
            await sut.execute(baseHttpRequest);
            // assert
            expect(spy).toHaveBeenCalledWith(baseHttpRequest.params.userId);
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=delete-user.test.js.map