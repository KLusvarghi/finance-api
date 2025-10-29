import { mock, MockProxy } from 'jest-mock-extended'

import { UserNotFoundError } from '@/errors'
import { GetTransactionsByUserIdService } from '@/services'
import {
    GetTransactionsByUserIdRepository,
    GetUserByIdRepository,
} from '@/shared'
import {
    getUserByIdRepositoryResponse,
    paginatedTransactionsRepositoryResponse,
    paginatedTransactionsServiceResponse,
    paginatedTransactionsWithNextCursorRepositoryResponse,
    paginatedTransactionsWithNextCursorServiceResponse,
    userId,
} from '@/test'

describe('GetTransactionsByUserIdService', () => {
    let sut: GetTransactionsByUserIdService
    let getUserByIdRepository: MockProxy<GetUserByIdRepository>
    let getTransactionByUserIdRepository: MockProxy<GetTransactionsByUserIdRepository>

    const params = {
        userId,
        title: undefined,
        type: undefined,
        from: new Date('2025-01-01'),
        to: new Date('2025-01-31'),
        limit: 20,
        cursor: undefined,
    }

    beforeEach(() => {
        getUserByIdRepository = mock<GetUserByIdRepository>()
        getTransactionByUserIdRepository =
            mock<GetTransactionsByUserIdRepository>()

        sut = new GetTransactionsByUserIdService(
            getUserByIdRepository,
            getTransactionByUserIdRepository,
        )

        // Setup default happy path
        getUserByIdRepository.execute.mockResolvedValue(
            getUserByIdRepositoryResponse,
        )
        getTransactionByUserIdRepository.execute.mockResolvedValue(
            paginatedTransactionsRepositoryResponse,
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })

    describe('error handling', () => {
        it('should throw UserNotFoundError if user not found', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValueOnce(null)

            // act
            const promise = sut.execute(params)

            // assert
            await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
        })

        it('should throw if GetUserByIdRepository throws', async () => {
            // arrange
            getUserByIdRepository.execute.mockRejectedValueOnce(
                new Error('GetUserByIdRepository error'),
            )

            // act
            const promise = sut.execute(params)

            // assert
            await expect(promise).rejects.toThrow(
                new Error('GetUserByIdRepository error'),
            )
        })

        it('should throw if GetTransactionsByUserIdRepository throws', async () => {
            // arrange
            getTransactionByUserIdRepository.execute.mockRejectedValueOnce(
                new Error('GetTransactionsByUserIdRepository error'),
            )

            // act
            const promise = sut.execute(params)

            // assert
            await expect(promise).rejects.toThrow(
                new Error('GetTransactionsByUserIdRepository error'),
            )
        })
    })

    describe('success', () => {
        it('should get paginated transactions by user id successfully', async () => {
            // arrange - using the default setup from beforeEach

            // act
            const response = await sut.execute(params)

            // assert
            expect(response).toEqual(paginatedTransactionsServiceResponse)
        })

        it('should return paginated transactions with nextCursor when there are more pages', async () => {
            // arrange
            getTransactionByUserIdRepository.execute.mockResolvedValue(
                paginatedTransactionsWithNextCursorRepositoryResponse,
            )

            // act
            const response = await sut.execute(params)

            // assert
            expect(response).toHaveProperty('transactions')
            expect(response).toHaveProperty('nextCursor')
            expect(response.transactions).toEqual(
                paginatedTransactionsWithNextCursorServiceResponse.transactions,
            )
            expect(response.nextCursor).not.toBeNull()
            expect(typeof response.nextCursor).toBe('string')
        })

        it('should handle filtering with minimal params', async () => {
            // arrange
            const minimalParams = { userId }

            // act
            const response = await sut.execute(minimalParams)

            // assert
            expect(response).toEqual(paginatedTransactionsServiceResponse)
        })
    })

    describe('validations', () => {
        it('should call GetUserByIdRepository with correct params', async () => {
            // act
            await sut.execute(params)

            // assert
            expect(getUserByIdRepository.execute).toHaveBeenCalledWith(
                params.userId,
            )
            expect(getUserByIdRepository.execute).toHaveBeenCalledTimes(1)
        })

        it('should call GetTransactionByUserIdRepository with correct params', async () => {
            // act
            await sut.execute(params)

            // assert
            expect(
                getTransactionByUserIdRepository.execute,
            ).toHaveBeenCalledWith(params)
            expect(
                getTransactionByUserIdRepository.execute,
            ).toHaveBeenCalledTimes(1)
        })

        it('should call GetTransactionByUserIdRepository with minimal params when filters not provided', async () => {
            // arrange
            const minimalParams = { userId }

            // act
            await sut.execute(minimalParams)

            // assert
            expect(
                getTransactionByUserIdRepository.execute,
            ).toHaveBeenCalledWith(minimalParams)
            expect(
                getTransactionByUserIdRepository.execute,
            ).toHaveBeenCalledTimes(1)
        })
    })
})
