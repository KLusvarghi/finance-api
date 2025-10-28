import { mock, MockProxy } from 'jest-mock-extended'

import { DeleteUserController } from '@/controllers'
import { UserNotFoundError } from '@/errors'
import { DeleteUserService } from '@/services'
import { HttpResponseSuccessBody, ResponseMessage } from '@/shared'
import {
    deleteUserHttpRequest as baseHttpRequest,
    deleteUserRepositoryResponse,
    userId,
} from '@/test'

describe('DeleteUserController', () => {
    let sut: DeleteUserController
    let deleteUserService: MockProxy<DeleteUserService>

    beforeEach(() => {
        deleteUserService = mock<DeleteUserService>()
        sut = new DeleteUserController(deleteUserService)

        // Happy path setup - configure success scenario by default
        deleteUserService.execute.mockResolvedValue(
            deleteUserRepositoryResponse,
        )
    })

    describe('error handling', () => {
        it('should throw UserNotFoundError when DeleteUserService throws UserNotFoundError', async () => {
            // arrange
            const userNotFoundError = new UserNotFoundError(userId)
            deleteUserService.execute.mockRejectedValue(userNotFoundError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                UserNotFoundError,
            )
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                `User with id ${userId} not found`,
            )
        })

        it('should throw generic error when DeleteUserService throws generic error', async () => {
            // arrange
            const genericError = new Error('Generic service error')
            deleteUserService.execute.mockRejectedValue(genericError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                genericError,
            )
        })
    })

    describe('success cases', () => {
        it('should return 200 if user is deleted successfully', async () => {
            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.success).toBe(true)
            expect(response.body?.message).toBe(ResponseMessage.USER_DELETED)
            expect((response.body as HttpResponseSuccessBody)?.data).toEqual(
                deleteUserRepositoryResponse,
            )
        })
    })

    describe('service integration', () => {
        it('should call DeleteUserService with correct parameters', async () => {
            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(deleteUserService.execute).toHaveBeenCalledWith(
                baseHttpRequest.headers.userId,
            )
            expect(deleteUserService.execute).toHaveBeenCalledTimes(1)
        })
    })
})
