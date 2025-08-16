import { CreateTransactionService } from './create-transaction';
import { UserNotFoundError } from '@/errors/user';
import { createTransactionParams, createTransactionServiceResponse, createTransactionRepositoryResponse, getUserByIdRepositoryResponse, } from '@/test';
describe('CreateTransactionService', () => {
    let sut;
    let createTransactionRepository;
    let getUserByIdRepository;
    let idGenerator;
    class CreateTransactionRepositoryStub {
        async execute(_params) {
            return Promise.resolve(createTransactionRepositoryResponse);
        }
    }
    class GetUserByIdRepositoryStub {
        async execute(_userId) {
            return Promise.resolve(getUserByIdRepositoryResponse);
        }
    }
    class IdGeneratorAdapterStub {
        execute() {
            return createTransactionServiceResponse.id;
        }
    }
    const makeSut = () => {
        const createTransactionRepository = new CreateTransactionRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const idGenerator = new IdGeneratorAdapterStub();
        const sut = new CreateTransactionService(createTransactionRepository, getUserByIdRepository, idGenerator);
        return {
            sut,
            createTransactionRepository,
            getUserByIdRepository,
            idGenerator,
        };
    };
    beforeEach(() => {
        const { sut: service, createTransactionRepository: createTransactionRepositoryStub, getUserByIdRepository: getUserByIdRepositoryStub, idGenerator: idGeneratorAdapterStub, } = makeSut();
        sut = service;
        createTransactionRepository = createTransactionRepositoryStub;
        getUserByIdRepository = getUserByIdRepositoryStub;
        idGenerator = idGeneratorAdapterStub;
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });
    describe('error handling', () => {
        it('should throw UserNotFoundError if user is not found', async () => {
            // arrange
            jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null);
            // act
            // lembrando que não passamos o await para que a promise não seja resolvida
            // e sim rejeitada
            const promise = sut.execute(createTransactionParams);
            // assert
            await expect(promise).rejects.toThrow(new UserNotFoundError(createTransactionParams.user_id));
        });
        // garantindo que o erro seja lançado para cima
        it('should throw if GetUserByIdRepository throws', async () => {
            // arrange
            jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(new Error());
            // act
            const promise = sut.execute(createTransactionParams);
            // assert
            await expect(promise).rejects.toThrow();
        });
        // garantindo que o erro seja lançado para cima
        it('should throw if IdGeneratorAdapter throws', async () => {
            // arrange
            jest.spyOn(idGenerator, 'execute').mockImplementationOnce(() => {
                throw new Error('idGenerator error');
            });
            // act
            const promise = sut.execute(createTransactionParams);
            // assert
            await expect(promise).rejects.toThrow(new Error('idGenerator error'));
        });
        // garantindo que o erro seja lançado para cima
        it('should throw if CreateTransactionRepository throws', async () => {
            // arrange
            jest.spyOn(createTransactionRepository, 'execute').mockRejectedValue(new Error('createTransactionRepository error'));
            // act
            const promise = sut.execute(createTransactionParams);
            // assert
            await expect(promise).rejects.toThrow(new Error('createTransactionRepository error'));
        });
    });
    describe('success', () => {
        it('should create transaction successfully', async () => {
            // act
            const response = await sut.execute(createTransactionParams);
            // assert
            expect(response).toBeTruthy();
            expect(response).toEqual(createTransactionServiceResponse);
        });
    });
    describe('validations', () => {
        it('should call GetUserByIdRepository with correct params', async () => {
            const getUserByIdRepositorySpy = jest.spyOn(getUserByIdRepository, 'execute');
            await sut.execute(createTransactionParams);
            expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(createTransactionParams.user_id);
            expect(getUserByIdRepositorySpy).toHaveBeenCalledTimes(1);
        });
        it('should call IdGeneratorAdapter to generate a random uuid', async () => {
            const idGeneratorAdapterSpy = jest.spyOn(idGenerator, 'execute');
            await sut.execute(createTransactionParams);
            expect(idGeneratorAdapterSpy).toHaveBeenCalled();
            expect(idGeneratorAdapterSpy).toHaveBeenCalledTimes(1);
            expect(idGeneratorAdapterSpy).toHaveReturnedWith(createTransactionServiceResponse.id);
        });
        it('should call CreateTransactionRepository with correct params', async () => {
            const createTransactionRepositorySpy = jest.spyOn(createTransactionRepository, 'execute');
            const response = await sut.execute(createTransactionParams);
            expect(createTransactionRepositorySpy).toHaveBeenCalledWith({
                ...createTransactionParams,
                id: createTransactionServiceResponse.id,
            });
            expect(createTransactionRepositorySpy).toHaveBeenCalledTimes(1);
            expect(response).toEqual(createTransactionServiceResponse);
        });
    });
});
//# sourceMappingURL=create-transaction.test.js.map