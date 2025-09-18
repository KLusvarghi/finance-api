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
        it('should return 200 when finding paginated transactions by user id', async () => {
            // arrange - using default setup from beforeEach

            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.success).toBe(true)
            expect(
                (response.body as HttpResponseSuccessBody)?.data,
            ).toStrictEqual(paginatedTransactionsServiceResponse)
        })

        it('should call GetTransactionsByUserIdService with correct parameters including filters and pagination', async () => {
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
    })
})
