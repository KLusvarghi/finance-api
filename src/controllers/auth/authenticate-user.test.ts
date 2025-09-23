import { mock, MockProxy } from 'jest-mock-extended'

import { AuthenticateUserController } from './authenticate-user'

import { LoginFailedError } from '@/errors'
import { AuthenticateUserService } from '@/services'
import { HttpResponseSuccessBody, ResponseMessage } from '@/shared'
import {
    createUserRepositoryResponse,
    createUserServiceResponse,
    loginUserHttpRequest as baseHttpRequest,
    tokensGeneratorAdapterResponse,
} from '@/test'

describe('AuthenticateUserController', () => {
    let sut: AuthenticateUserController
    let authenticateUserService: MockProxy<AuthenticateUserService>

    const expectedUserData = {
        ...createUserServiceResponse,
        password: createUserRepositoryResponse.password,
        tokens: tokensGeneratorAdapterResponse,
    }

    beforeEach(() => {
        authenticateUserService = mock<AuthenticateUserService>()
        sut = new AuthenticateUserController(authenticateUserService)

        // Happy path setup - configure success scenario by default
        authenticateUserService.execute.mockResolvedValue(expectedUserData)
    })

    describe('error handling', () => {
        it('should throw LoginFailedError when user is not found', async () => {
            // arrange
            const loginFailedError = new LoginFailedError()
            authenticateUserService.execute.mockRejectedValue(loginFailedError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                LoginFailedError,
            )
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                ResponseMessage.USER_INVALID_PASSWORD_OR_EMAIL,
            )
        })

        it('should throw LoginFailedError when password is invalid', async () => {
            // arrange
            const loginFailedError = new LoginFailedError()
            authenticateUserService.execute.mockRejectedValue(loginFailedError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                LoginFailedError,
            )
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                ResponseMessage.USER_INVALID_PASSWORD_OR_EMAIL,
            )
        })
    })

    describe('success cases', () => {
        it('should return 200 and the user when login is successful', async () => {
            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.success).toBe(true)
            expect((response.body as HttpResponseSuccessBody)?.data).toEqual(
                expectedUserData,
            )
            expect(response.body?.message).toBe(
                ResponseMessage.USER_LOGIN_SUCCESS,
            )
        })
    })

    describe('service integration', () => {
        it('should call AuthenticateUserService with correct parameters', async () => {
            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(authenticateUserService.execute).toHaveBeenCalledWith(
                baseHttpRequest.body.email,
                baseHttpRequest.body.password,
            )
            expect(authenticateUserService.execute).toHaveBeenCalledTimes(1)
        })
    })
})
