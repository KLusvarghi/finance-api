import { mock, MockProxy } from 'jest-mock-extended'
import jwt from 'jsonwebtoken'

import { RefreshTokenController, RefreshTokenRequest } from './refresh-token'

import { UserNotFoundError } from '@/errors'
import { RefreshTokenService } from '@/services'
import { HttpResponseSuccessBody, RefreshTokenResponse } from '@/shared'
// Import the interface from the controller instead of duplicating it
import { tokensGeneratorAdapterResponse } from '@/test'

describe('RefreshTokenController', () => {
    let sut: RefreshTokenController
    let refreshTokenService: MockProxy<RefreshTokenService>

    const baseHttpRequest: RefreshTokenRequest = {
        body: {
            refreshToken: 'valid.refresh.token',
        },
    }

    beforeEach(() => {
        // Setup executado antes de cada teste
        refreshTokenService = mock<RefreshTokenService>()
        sut = new RefreshTokenController(refreshTokenService)
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })

    describe('error handling', () => {
        it('should throw TokenExpiredError when service throws it', async () => {
            // arrange
            const tokenExpiredError = new jwt.TokenExpiredError(
                'jwt expired',
                new Date(),
            )
            refreshTokenService.execute.mockRejectedValue(tokenExpiredError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                jwt.TokenExpiredError,
            )
        })

        it('should throw JsonWebTokenError when service throws it', async () => {
            // arrange
            const jsonWebTokenError = new jwt.JsonWebTokenError('invalid token')
            refreshTokenService.execute.mockRejectedValue(jsonWebTokenError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                jwt.JsonWebTokenError,
            )
        })

        it('should throw NotBeforeError when service throws it', async () => {
            // arrange
            const notBeforeError = new jwt.NotBeforeError(
                'jwt not active',
                new Date(),
            )
            refreshTokenService.execute.mockRejectedValue(notBeforeError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                jwt.NotBeforeError,
            )
        })

        it('should throw UserNotFoundError when service throws it', async () => {
            // arrange
            const userNotFoundError = new UserNotFoundError('user123')
            refreshTokenService.execute.mockRejectedValue(userNotFoundError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                UserNotFoundError,
            )
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                'User with id user123 not found',
            )
        })

        it('should throw generic error when service throws generic error', async () => {
            // arrange
            const genericError = new Error('Unexpected database error')
            refreshTokenService.execute.mockRejectedValue(genericError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                genericError,
            )
        })
    })

    describe('success cases', () => {
        it('should return 200 with new tokens when refresh is successful', async () => {
            // arrange
            refreshTokenService.execute.mockResolvedValueOnce(
                tokensGeneratorAdapterResponse,
            )

            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(201)
            expect(response.body?.success).toBe(true)
            expect((response.body as HttpResponseSuccessBody)?.data).toEqual(
                tokensGeneratorAdapterResponse,
            )
            expect(
                (response.body as HttpResponseSuccessBody<RefreshTokenResponse>)
                    ?.data?.accessToken,
            ).toBeDefined()
            expect(
                (response.body as HttpResponseSuccessBody<RefreshTokenResponse>)
                    ?.data?.refreshToken,
            ).toBeDefined()
            expect(
                typeof (
                    response.body as HttpResponseSuccessBody<RefreshTokenResponse>
                )?.data?.accessToken,
            ).toBe('string')
            expect(
                typeof (
                    response.body as HttpResponseSuccessBody<RefreshTokenResponse>
                )?.data?.refreshToken,
            ).toBe('string')
        })

        it('should call RefreshTokenService with correct parameters', async () => {
            // arrange
            refreshTokenService.execute.mockResolvedValueOnce(
                tokensGeneratorAdapterResponse,
            )

            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(refreshTokenService.execute).toHaveBeenCalledWith(
                baseHttpRequest.body.refreshToken,
            )
            expect(refreshTokenService.execute).toHaveBeenCalledTimes(1)
        })
    })
})
