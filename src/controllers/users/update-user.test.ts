import { mock, MockProxy } from 'jest-mock-extended'

import { UpdateUserController } from '@/controllers'
import {
    EmailAlreadyExistsError,
    UpdateUserFailedError,
    UserNotFoundError,
} from '@/errors'
import { UpdateUserService } from '@/services'
import { HttpResponseSuccessBody } from '@/shared'
import {
    updateUserHttpRequest as baseHttpRequest,
    updateUserRepositoryResponse,
} from '@/test'

describe('UpdateUserController', () => {
    let sut: UpdateUserController
    let updateUserService: MockProxy<UpdateUserService>

    beforeEach(() => {
        // Setup executado antes de cada teste
        updateUserService = mock<UpdateUserService>()
        sut = new UpdateUserController(updateUserService)
    })

    afterEach(() => {
        // Limpeza após cada teste
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('error handling', () => {
        it('should throw generic error when UpdateUserService throws generic error', async () => {
            // arrange
            const genericError = new Error('Database connection failed')
            updateUserService.execute.mockRejectedValue(genericError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                genericError,
            )
        })

        it('should throw EmailAlreadyExistsError when UpdateUserService throws it', async () => {
            // arrange
            const emailError = new EmailAlreadyExistsError(
                baseHttpRequest.body.email,
            )
            updateUserService.execute.mockRejectedValue(emailError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                EmailAlreadyExistsError,
            )
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                `The e-mail ${baseHttpRequest.body.email} is already in use`,
            )
        })

        it('should throw UserNotFoundError when UpdateUserService throws it', async () => {
            // arrange
            const userNotFoundError = new UserNotFoundError(
                baseHttpRequest.headers.userId,
            )
            updateUserService.execute.mockRejectedValue(userNotFoundError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                UserNotFoundError,
            )
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                `User with id ${baseHttpRequest.headers.userId} not found`,
            )
        })

        it('should throw UpdateUserFailedError when UpdateUserService throws it', async () => {
            // arrange
            const updateUserFailedError = new UpdateUserFailedError()
            updateUserService.execute.mockRejectedValue(updateUserFailedError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                UpdateUserFailedError,
            )
        })
    })

    describe('success cases', () => {
        it('should return 200 when updating user successfully', async () => {
            // arrange
            updateUserService.execute.mockResolvedValueOnce(
                updateUserRepositoryResponse,
            )

            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.success).toBe(true)
            expect(response.body?.message).toBeTruthy()
            expect((response.body as HttpResponseSuccessBody)?.data).toEqual(
                updateUserRepositoryResponse,
            )
        })

        it('should call UpdateUserService with correct parameters', async () => {
            // arrange
            updateUserService.execute.mockResolvedValueOnce(
                updateUserRepositoryResponse,
            )

            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(updateUserService.execute).toHaveBeenCalledWith(
                baseHttpRequest.headers.userId,
                baseHttpRequest.body,
            )
            expect(updateUserService.execute).toHaveBeenCalledTimes(1)
        })
    })
})
