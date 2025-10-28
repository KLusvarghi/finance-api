import { mock, MockProxy } from 'jest-mock-extended'

import { ForbiddenError, TransactionNotFoundError } from '@/errors'
import {
    PostgresGetTransactionByIdRepository,
    PostgresUpdateTransactionRepository,
} from '@/repositories/postgres'
import { UpdateTransactionService } from '@/services'
import {
    transactionId,
    updateTransactionParams,
    updateTransactionRepositoryResponse,
    updateTransactionServiceResponse,
    userId,
} from '@/test'

describe('UpdateTransactionService', () => {
    let sut: UpdateTransactionService
    let updateTransactionRepository: MockProxy<PostgresUpdateTransactionRepository>
    let getTransactionByIdRepository: MockProxy<PostgresGetTransactionByIdRepository>

    beforeEach(() => {
        updateTransactionRepository =
            mock<PostgresUpdateTransactionRepository>()
        getTransactionByIdRepository =
            mock<PostgresGetTransactionByIdRepository>()

        sut = new UpdateTransactionService(
            updateTransactionRepository,
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
            const promise = sut.execute(transactionId, {
                ...updateTransactionParams,
                userId,
            })

            // assert
            await expect(promise).rejects.toThrow(
                new TransactionNotFoundError(transactionId),
            )
        })

        it('should throw if UpdateTransactionRepository throws', async () => {
            // arrange
            getTransactionByIdRepository.execute.mockResolvedValue(
                updateTransactionRepositoryResponse,
            )
            updateTransactionRepository.execute.mockRejectedValueOnce(
                new Error('UpdateTransactionRepository error'),
            )

            // act
            const promise = sut.execute(transactionId, {
                ...updateTransactionParams,
                userId,
            })

            // assert
            await expect(promise).rejects.toThrow(
                new Error('UpdateTransactionRepository error'),
            )
        })

        it('should throw ForbiddenError if user is not the owner of the transaction', async () => {
            // arrange
            getTransactionByIdRepository.execute.mockResolvedValueOnce({
                ...updateTransactionRepositoryResponse,
                userId: 'another-user-id',
            })

            // act
            const promise = sut.execute(transactionId, {
                ...updateTransactionParams,
                userId,
            })

            // assert
            await expect(promise).rejects.toThrow(new ForbiddenError())
        })
    })

    describe('success', () => {
        it('should update transaction successfully', async () => {
            // arrange
            getTransactionByIdRepository.execute.mockResolvedValue(
                updateTransactionRepositoryResponse,
            )
            updateTransactionRepository.execute.mockResolvedValue(
                updateTransactionRepositoryResponse,
            )

            // act
            const response = await sut.execute(transactionId, {
                ...updateTransactionParams,
                userId,
            })

            // assert
            expect(response).toBeTruthy()
            expect(response).toStrictEqual(updateTransactionServiceResponse)
        })
    })

    describe('validations', () => {
        it('should call GetTransactionByIdRepository with correct params', async () => {
            // arrange
            getTransactionByIdRepository.execute.mockResolvedValue(
                updateTransactionRepositoryResponse,
            )
            updateTransactionRepository.execute.mockResolvedValue(
                updateTransactionRepositoryResponse,
            )

            // act
            await sut.execute(transactionId, {
                ...updateTransactionParams,
                userId,
            })

            // assert
            expect(getTransactionByIdRepository.execute).toHaveBeenCalledWith(
                transactionId,
            )
            expect(getTransactionByIdRepository.execute).toHaveBeenCalledTimes(
                1,
            )
        })

        it('should call UpdateTransactionRepository with correct params', async () => {
            // arrange
            getTransactionByIdRepository.execute.mockResolvedValue(
                updateTransactionRepositoryResponse,
            )
            updateTransactionRepository.execute.mockResolvedValue(
                updateTransactionRepositoryResponse,
            )

            // act
            await sut.execute(transactionId, {
                ...updateTransactionParams,
                userId,
            })

            // assert
            expect(updateTransactionRepository.execute).toHaveBeenCalledWith(
                transactionId,
                updateTransactionParams,
            )
            expect(updateTransactionRepository.execute).toHaveBeenCalledTimes(1)
        })
    })
})
