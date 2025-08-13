import { DeleteTransactionService } from './delete-transaction'
import { TransactionRepositoryResponse } from '@/shared'
import { TransactionNotFoundError } from '@/errors/user'
import {
    transactionId,
    deleteTransactionServiceResponse,
    deleteTransactionRepositoryResponse,
} from '@/test'

describe('DeleteTransactionService', () => {
    let sut: DeleteTransactionService
    let deleteTransactionRepository: DeleteTransactionRepositoryStub

    class DeleteTransactionRepositoryStub {
        async execute(
            _id: string,
        ): Promise<TransactionRepositoryResponse | null> {
            return Promise.resolve(deleteTransactionRepositoryResponse)
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionService(deleteTransactionRepository)

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
