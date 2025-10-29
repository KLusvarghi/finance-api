import { mock, MockProxy } from 'jest-mock-extended'

import { TransactionNotFoundError } from '@/errors'
import {
    PostgresDeleteTransactionRepository,
    PostgresGetTransactionByIdRepository,
} from '@/repositories/postgres'
import { DeleteTransactionService } from '@/services'
import {
    deleteTransactionRepositoryResponse,
    deleteTransactionServiceResponse,
    transactionId,
    updateTransactionRepositoryResponse,
} from '@/test'

describe('DeleteTransactionService', () => {
    let sut: DeleteTransactionService
    let deleteTransactionRepository: MockProxy<PostgresDeleteTransactionRepository>
    let getTransactionByIdRepository: MockProxy<PostgresGetTransactionByIdRepository>

    beforeEach(() => {
        deleteTransactionRepository =
            mock<PostgresDeleteTransactionRepository>()
        getTransactionByIdRepository =
            mock<PostgresGetTransactionByIdRepository>()

        sut = new DeleteTransactionService(
            deleteTransactionRepository,
            getTransactionByIdRepository,
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })

    describe('error handling', () => {
        it('should throw TransactionNotFoundError if getTransactionByIdRepository returns null', async () => {
            // arrange
            getTransactionByIdRepository.execute.mockResolvedValueOnce(null)

            // act
            const promise = sut.execute({
                transactionId: 'invalid_transaction_id',
                userId: 'user-id',
            })

            // assert
            await expect(promise).rejects.toThrow(
                new TransactionNotFoundError('invalid_transaction_id'),
            )
        })

        it('should throw if DeleteTransactionRepository throws', async () => {
            // arrange
            getTransactionByIdRepository.execute.mockResolvedValue(
                updateTransactionRepositoryResponse,
            )
            deleteTransactionRepository.execute.mockRejectedValueOnce(
                new Error(),
            )

            // act
            const promise = sut.execute({ transactionId, userId: 'user-id' })

            // assert
            await expect(promise).rejects.toThrow()
        })
    })

    describe('success', () => {
        it('should delete transaction successfully', async () => {
            // arrange
            getTransactionByIdRepository.execute.mockResolvedValue({
                ...updateTransactionRepositoryResponse,
                userId: 'user-id',
            })
            deleteTransactionRepository.execute.mockResolvedValue(
                deleteTransactionRepositoryResponse,
            )

            // act
            const response = await sut.execute({
                transactionId,
                userId: 'user-id',
            })

            // assert
            expect(response).toEqual(deleteTransactionServiceResponse)
        })
    })

    describe('validation', () => {
        it('should call DeleteTransactionRepository with correct params', async () => {
            // arrange
            getTransactionByIdRepository.execute.mockResolvedValue({
                ...updateTransactionRepositoryResponse,
                userId: 'user-id',
            })
            deleteTransactionRepository.execute.mockResolvedValue(
                deleteTransactionRepositoryResponse,
            )

            // act
            await sut.execute({ transactionId, userId: 'user-id' })

            // assert
            expect(deleteTransactionRepository.execute).toHaveBeenCalledWith(
                transactionId,
            )
            expect(deleteTransactionRepository.execute).toHaveBeenCalledTimes(1)
        })
    })
})
