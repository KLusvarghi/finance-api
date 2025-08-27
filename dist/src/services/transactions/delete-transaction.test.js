import { TransactionNotFoundError } from '@/errors'
import { DeleteTransactionService } from '@/services'
import {
    deleteTransactionRepositoryResponse,
    deleteTransactionServiceResponse,
    transactionId,
    updateTransactionRepositoryResponse,
} from '@/test'
describe('DeleteTransactionService', () => {
    let sut
    let deleteTransactionRepository
    class DeleteTransactionRepositoryStub {
        async execute(_id) {
            return Promise.resolve(deleteTransactionRepositoryResponse)
        }
    }
    class GetTransactionByIdRepositoryStub {
        async execute(_transactionId) {
            return Promise.resolve(updateTransactionRepositoryResponse)
        }
    }
    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()
        const sut = new DeleteTransactionService(
            deleteTransactionRepository,
            getTransactionByIdRepository,
        )
        return {
            sut,
            deleteTransactionRepository,
        }
    }
    beforeEach(() => {
        const {
            sut: service,
            deleteTransactionRepository: deleteTransactionRepositoryStub,
        } = makeSut()
        sut = service
        deleteTransactionRepository = deleteTransactionRepositoryStub
    })
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })
    describe('error handling', () => {
        it('should throw TransactionNotFoundError if DeleteTransactionRepository returns null', async () => {
            // arrange
            jest.spyOn(
                deleteTransactionRepository,
                'execute',
            ).mockResolvedValueOnce(null)
            // act
            const promise = sut.execute('invalid_transaction_id')
            // assert
            expect(promise).rejects.toThrow(
                new TransactionNotFoundError('invalid_transaction_id'),
            )
        })
    })
    it('should throw if DeleteTransactionRepository throws', async () => {
        // arrange
        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())
        // act
        const promise = sut.execute(transactionId)
        // assert
        expect(promise).rejects.toThrow()
    })
    describe('success', () => {
        it('should delete transaction successfully', async () => {
            // act
            const response = await sut.execute(transactionId)
            // assert
            expect(response).toEqual(deleteTransactionServiceResponse)
        })
    })
    describe('validation', () => {
        it('should call DeleteTransactionRepository with correct params', async () => {
            // arrange
            const deleteTransactionRepositorySpy = jest.spyOn(
                deleteTransactionRepository,
                'execute',
            )
            // act
            await sut.execute(transactionId)
            // assert
            expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(
                transactionId,
            )
            expect(deleteTransactionRepositorySpy).toHaveBeenCalledTimes(1)
        })
    })
})
//# sourceMappingURL=delete-transaction.test.js.map
