import { TransactionNotFoundError } from '@/errors'
import { UpdateTransactionService } from '@/services'
import {
    transactionId,
    updateTransactionParams,
    updateTransactionRepositoryResponse,
    updateTransactionServiceResponse,
} from '@/test'
describe('UpdateTransactionService', () => {
    let sut
    let updateTransactionRepository
    class UpdateTransactionRepositoryStub {
        async execute(_transactionId, _params) {
            return Promise.resolve(updateTransactionRepositoryResponse)
        }
    }
    class GetTransactionByIdRepositoryStub {
        async execute(_transactionId) {
            return Promise.resolve(updateTransactionRepositoryResponse)
        }
    }
    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()
        const sut = new UpdateTransactionService(
            updateTransactionRepository,
            getTransactionByIdRepository,
        )
        return {
            sut,
            updateTransactionRepository,
        }
    }
    beforeEach(() => {
        const {
            sut: service,
            updateTransactionRepository: updateTransactionRepositoryStub,
        } = makeSut()
        sut = service
        updateTransactionRepository = updateTransactionRepositoryStub
    })
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })
    describe('error handling', () => {
        it('should throw UserNotFoundError if getUserByIdRepository return null', () => {
            // arrange
            jest.spyOn(
                updateTransactionRepository,
                'execute',
            ).mockResolvedValueOnce(null)
            // act
            const promise = sut.execute(transactionId, updateTransactionParams)
            // assert
            expect(promise).rejects.toThrow(
                new TransactionNotFoundError(transactionId),
            )
        })
        it('should throw if UpdateTransactionRepository throws', () => {
            // arrange
            jest.spyOn(
                updateTransactionRepository,
                'execute',
            ).mockRejectedValueOnce(
                new Error('UpdateTransactionRepository error'),
            )
            // act
            const promise = sut.execute(transactionId, updateTransactionParams)
            // assert
            expect(promise).rejects.toThrow(
                new Error('UpdateTransactionRepository error'),
            )
        })
    })
    describe('success', () => {
        it('should update transaction successfully', async () => {
            // act
            const response = await sut.execute(
                transactionId,
                updateTransactionParams,
            )
            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual(updateTransactionServiceResponse)
        })
    })
    describe('validations', () => {
        it('should call UpdateTransactionRepository with correct params', async () => {
            // arrange
            const updateTransactionRepositorySpy = jest.spyOn(
                updateTransactionRepository,
                'execute',
            )
            // act
            await sut.execute(transactionId, updateTransactionParams)
            // assert
            expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
                transactionId,
                updateTransactionParams,
            )
            expect(updateTransactionRepositorySpy).toHaveBeenCalledTimes(1)
        })
    })
})
//# sourceMappingURL=update-transaction.test.js.map
