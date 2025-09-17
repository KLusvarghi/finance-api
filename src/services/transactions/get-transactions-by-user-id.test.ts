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

    const from = '2025-01-01'
    const to = '2025-01-31'
    const options = { limit: 20, cursor: undefined }

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
            const promise = sut.execute({ userId, from, to, options })

            // assert
            await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
        })

        it('should throw if GetUserByIdRepository throws', async () => {
            // arrange
            getUserByIdRepository.execute.mockRejectedValueOnce(
                new Error('GetUserByIdRepository error'),
            )

            // act
            const promise = sut.execute(userId, from, to, options)

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
            const promise = sut.execute(userId, from, to, options)

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
            const response = await sut.execute(userId, from, to, options)

            // assert
            expect(response).toEqual(paginatedTransactionsServiceResponse)
        })

        it('should return paginated transactions with nextCursor when there are more pages', async () => {
            // arrange
            getTransactionByUserIdRepository.execute.mockResolvedValue(
                paginatedTransactionsWithNextCursorRepositoryResponse,
            )

            // act
            const response = await sut.execute(userId, from, to, options)

            // assert
            expect(response).toHaveProperty('transactions')
            expect(response).toHaveProperty('nextCursor')
            expect(response.transactions).toEqual(
                paginatedTransactionsWithNextCursorServiceResponse.transactions,
            )
            expect(response.nextCursor).not.toBeNull()
            expect(typeof response.nextCursor).toBe('string')
        })

        it('should handle pagination without options (use defaults)', async () => {
            // act
            const response = await sut.execute(userId, from, to)

            // assert
            expect(response).toEqual(paginatedTransactionsServiceResponse)
        })
    })

    describe('validations', () => {
        it('should call GetUserByIdRepository with correct params', async () => {
            // act
            await sut.execute(userId, from, to, options)

            // assert
            expect(getUserByIdRepository.execute).toHaveBeenCalledWith(userId)
            expect(getUserByIdRepository.execute).toHaveBeenCalledTimes(1)
        })

        it('should call GetTransactionByUserIdRepository with correct params', async () => {
            // act
            await sut.execute(userId, from, to, options)

            // assert
            expect(
                getTransactionByUserIdRepository.execute,
            ).toHaveBeenCalledWith(userId, from, to, options)
            expect(
                getTransactionByUserIdRepository.execute,
            ).toHaveBeenCalledTimes(1)
        })

        it('should call GetTransactionByUserIdRepository with default options when not provided', async () => {
            // act
            await sut.execute(userId, from, to)

            // assert
            expect(
                getTransactionByUserIdRepository.execute,
            ).toHaveBeenCalledWith(userId, from, to, undefined)
            expect(
                getTransactionByUserIdRepository.execute,
            ).toHaveBeenCalledTimes(1)
        })
    })
})
