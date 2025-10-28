import { mock, MockProxy } from 'jest-mock-extended'

import { GetUserBalanceController } from '@/controllers'
import { UserNotFoundError } from '@/errors'
import { GetUserBalanceService } from '@/services'
import {
    HttpResponseSuccessBody,
    UserBalanceRepositoryResponse,
} from '@/shared'
import {
    getUserBalanceHttpRequest as baseHttpRequest,
    userBalanceResponse,
    userId,
} from '@/test'

describe('GetUserBalanceController', () => {
    let sut: GetUserBalanceController
    let getUserBalanceService: MockProxy<GetUserBalanceService>

    beforeEach(() => {
        getUserBalanceService = mock<GetUserBalanceService>()
        sut = new GetUserBalanceController(getUserBalanceService)

        // Happy path setup - configure success scenario by default
        getUserBalanceService.execute.mockResolvedValue(userBalanceResponse)
    })

    describe('error handling', () => {
        it('should throw generic error when GetUserBalanceService throws generic error', async () => {
            // arrange
            const genericError = new Error('Database connection failed')
            getUserBalanceService.execute.mockRejectedValue(genericError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                genericError,
            )
        })

        it('should throw UserNotFoundError when GetUserBalanceService throws it', async () => {
            // arrange
            const userNotFoundError = new UserNotFoundError(userId)
            getUserBalanceService.execute.mockRejectedValue(userNotFoundError)

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
        it('should return 200 when getting user balance successfully', async () => {
            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.success).toBe(true)
            expect(response.body?.message).toBeTruthy()
            expect((response.body as HttpResponseSuccessBody)?.data).toEqual(
                userBalanceResponse,
            )
            expect(
                (
                    response.body as HttpResponseSuccessBody<UserBalanceRepositoryResponse>
                )?.data?.earnings,
            ).toBeDefined()
            expect(
                (
                    response.body as HttpResponseSuccessBody<UserBalanceRepositoryResponse>
                )?.data?.expenses,
            ).toBeDefined()
            expect(
                (
                    response.body as HttpResponseSuccessBody<UserBalanceRepositoryResponse>
                )?.data?.investments,
            ).toBeDefined()
            expect(
                (
                    response.body as HttpResponseSuccessBody<UserBalanceRepositoryResponse>
                )?.data?.balance,
            ).toBeDefined()
            expect(
                typeof (
                    response.body as HttpResponseSuccessBody<UserBalanceRepositoryResponse>
                )?.data?.earnings,
            ).toBe('string')
            expect(
                typeof (
                    response.body as HttpResponseSuccessBody<UserBalanceRepositoryResponse>
                )?.data?.expenses,
            ).toBe('string')
            expect(
                typeof (
                    response.body as HttpResponseSuccessBody<UserBalanceRepositoryResponse>
                )?.data?.investments,
            ).toBe('string')
            expect(
                typeof (
                    response.body as HttpResponseSuccessBody<UserBalanceRepositoryResponse>
                )?.data?.balance,
            ).toBe('string')
        })
    })

    describe('service integration', () => {
        it('should call GetUserBalanceService with correct parameters', async () => {
            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(getUserBalanceService.execute).toHaveBeenCalledWith(
                baseHttpRequest.headers.userId,
                baseHttpRequest.query.from,
                baseHttpRequest.query.to,
            )
            expect(getUserBalanceService.execute).toHaveBeenCalledTimes(1)
        })
    })
})
