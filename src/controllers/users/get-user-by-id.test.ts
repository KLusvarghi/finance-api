import { mock, MockProxy } from 'jest-mock-extended'

import { GetUserByIdController } from '@/controllers'
import { UserNotFoundError } from '@/errors'
import { GetUserByIdService } from '@/services'
import { HttpResponseSuccessBody, UserPublicResponse } from '@/shared'
import {
    getUserByIdHttpRequest as baseHttpRequest,
    getUserByIdServiceResponse,
    userId,
} from '@/test'

describe('GetUserByIdController', () => {
    let sut: GetUserByIdController
    let getUserByIdService: MockProxy<GetUserByIdService>

    beforeEach(() => {
        getUserByIdService = mock<GetUserByIdService>()
        sut = new GetUserByIdController(getUserByIdService)

        // Happy path setup - configure success scenario by default
        getUserByIdService.execute.mockResolvedValue(getUserByIdServiceResponse)
    })

    describe('error handling', () => {
        it('should throw UserNotFoundError when user is not found', async () => {
            // arrange
            const userNotFoundError = new UserNotFoundError(userId)
            getUserByIdService.execute.mockRejectedValue(userNotFoundError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                UserNotFoundError,
            )
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                `User with id ${userId} not found`,
            )
        })

        it('should throw generic error when GetUserByIdService throws an error', async () => {
            // arrange
            const genericError = new Error('Service error')
            getUserByIdService.execute.mockRejectedValue(genericError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                genericError,
            )
        })
    })

    describe('success cases', () => {
        it('should return 200 if user is found successfully', async () => {
            // act
            const response = await sut.execute({
                headers: { userId },
            })

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.success).toBe(true)
            expect(response.body?.message).toBeTruthy()
            expect(
                (response.body as HttpResponseSuccessBody)?.data,
            ).toBeTruthy()
            expect(
                (response.body as HttpResponseSuccessBody<UserPublicResponse>)
                    ?.data?.id,
            ).toBeTruthy()
            expect(
                (response.body as HttpResponseSuccessBody<UserPublicResponse>)
                    ?.data?.firstName,
            ).toBeTruthy()
            expect(
                (response.body as HttpResponseSuccessBody<UserPublicResponse>)
                    ?.data?.lastName,
            ).toBeTruthy()
            expect(
                (response.body as HttpResponseSuccessBody<UserPublicResponse>)
                    ?.data?.email,
            ).toBeTruthy()
            expect(
                (response.body as HttpResponseSuccessBody)?.data,
            ).not.toHaveProperty('password')
        })
    })

    describe('service integration', () => {
        it('should call GetUserByIdService with correct parameters', async () => {
            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(getUserByIdService.execute).toHaveBeenCalledWith(
                baseHttpRequest.headers.userId,
            )
            expect(getUserByIdService.execute).toHaveBeenCalledTimes(1)
        })
    })
})
