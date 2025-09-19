import { mock, MockProxy } from 'jest-mock-extended'

import { GetTransactionsByUserIdController } from '@/controllers'
import { UserNotFoundError } from '@/errors'
import { GetTransactionsByUserIdService } from '@/services'
import { HttpResponseSuccessBody } from '@/shared'
import {
    getTransactionsByUserIdHttpRequest as baseHttpRequest,
    paginatedTransactionsServiceResponse,
    userId,
} from '@/test'

// Mock the cache module
jest.mock('@/adapters', () => ({
    ...jest.requireActual('@/adapters'),
    cache: {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    },
}))

import { cache } from '@/adapters'
const mockedCache = jest.mocked(cache)

describe('GetTransactionsByUserIdController', () => {
    let sut: GetTransactionsByUserIdController
    let getTransactionsByUserIdService: MockProxy<GetTransactionsByUserIdService>

    beforeEach(() => {
        // Setup executado antes de cada teste
        getTransactionsByUserIdService = mock<GetTransactionsByUserIdService>()
        sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdService,
        )

        // Setup default happy path
        getTransactionsByUserIdService.execute.mockResolvedValue(
            paginatedTransactionsServiceResponse,
        )

        // Setup cache mocks - default to cache miss
        mockedCache.get.mockResolvedValue(null)
        mockedCache.set.mockResolvedValue()
        mockedCache.del.mockResolvedValue()
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('error handling', () => {
        it('should throw generic error when GetTransactionsByUserIdService throws generic error', async () => {
            // arrange
            const genericError = new Error('Database connection failed')
            getTransactionsByUserIdService.execute.mockRejectedValue(
                genericError,
            )

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                genericError,
            )
        })

        it('should throw UserNotFoundError when GetTransactionsByUserIdService throws it', async () => {
            // arrange
            const userNotFoundError = new UserNotFoundError(userId)
            getTransactionsByUserIdService.execute.mockRejectedValue(
                userNotFoundError,
            )

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                UserNotFoundError,
            )
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                `User with id ${userId} not found`,
            )
        })
    })

    describe('success cases', () => {
        it('should return 200 when finding paginated transactions by user id (cache miss)', async () => {
            // arrange - using default setup from beforeEach (cache miss)

            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.success).toBe(true)
            expect(
                (response.body as HttpResponseSuccessBody)?.data,
            ).toStrictEqual(paginatedTransactionsServiceResponse)

            // Verify cache was checked and then set
            expect(mockedCache.get).toHaveBeenCalledTimes(1)
            expect(mockedCache.set).toHaveBeenCalledWith(
                expect.stringContaining(`transactions:user:${userId}:`),
                paginatedTransactionsServiceResponse,
            )
        })

        it('should return cached data when cache hit occurs', async () => {
            // arrange - setup cache hit
            mockedCache.get.mockResolvedValueOnce(
                paginatedTransactionsServiceResponse,
            )

            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.success).toBe(true)
            expect(
                (response.body as HttpResponseSuccessBody)?.data,
            ).toStrictEqual(paginatedTransactionsServiceResponse)

            // Verify service was NOT called when cache hit
            expect(
                getTransactionsByUserIdService.execute,
            ).not.toHaveBeenCalled()
            expect(mockedCache.get).toHaveBeenCalledTimes(1)
            expect(mockedCache.set).not.toHaveBeenCalled()
        })

        it('should call GetTransactionsByUserIdService with correct parameters when cache miss', async () => {
            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(getTransactionsByUserIdService.execute).toHaveBeenCalledWith(
                {
                    userId: baseHttpRequest.headers.userId,
                    title: baseHttpRequest.query.title,
                    type: baseHttpRequest.query.type,
                    from: baseHttpRequest.query.from,
                    to: baseHttpRequest.query.to,
                    limit: baseHttpRequest.query.limit,
                    cursor: baseHttpRequest.query.cursor,
                },
            )
            expect(
                getTransactionsByUserIdService.execute,
            ).toHaveBeenCalledTimes(1)
        })

        it('should generate correct cache key based on userId and query parameters', async () => {
            // act
            await sut.execute(baseHttpRequest)

            // assert - verify cache key format
            expect(mockedCache.get).toHaveBeenCalledWith(
                expect.stringMatching(
                    /^transactions:user:[^:]+:[A-Za-z0-9+/=]+$/,
                ),
            )
        })
    })
})
