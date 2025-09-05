import jwt from 'jsonwebtoken'

import { RefreshTokenController } from './refresh-token'

import { UserNotFoundError } from '@/errors'
import { RefreshTokenService } from '@/services'
import { RefreshTokenRequest, RefreshTokenResponse } from '@/shared'
import { tokensGeneratorAdapterResponse } from '@/test'

describe('RefreshTokenController', () => {
    let sut: RefreshTokenController
    let refreshTokenService: RefreshTokenServiceStub

    class RefreshTokenServiceStub {
        async execute(_refreshToken: string): Promise<RefreshTokenResponse> {
            return tokensGeneratorAdapterResponse
        }
    }

    const makeSut = () => {
        const refreshTokenService = new RefreshTokenServiceStub()
        const sut = new RefreshTokenController(
            refreshTokenService as unknown as RefreshTokenService,
        )
        return {
            sut,
            refreshTokenService,
        }
    }

    const baseHttpRequest: RefreshTokenRequest = {
        body: {
            refreshToken: 'valid.refresh.token',
        },
    }

    beforeEach(() => {
        const { sut: controller, refreshTokenService: serviceStub } = makeSut()
        sut = controller
        refreshTokenService = serviceStub
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })

    describe('validation errors', () => {
        it.each([
            ['is not provided', {}, 'Refresh token is required'],
            ['is null', { refreshToken: null }, 'Refresh token is required'],
            [
                'is undefined',
                { refreshToken: undefined },
                'Refresh token is required',
            ],
            [
                'is empty string',
                { refreshToken: '' },
                'Refresh token must have at least 1 character',
            ],
            [
                'is only whitespace',
                { refreshToken: '   ' },
                'Refresh token must have at least 1 character',
            ],
        ])(
            'should return 400 if refreshToken %s',
            async (_description, body, expectedMessage) => {
                const response = await sut.execute({
                    body,
                } as RefreshTokenRequest)

                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBe(expectedMessage)
            },
        )
    })

    describe('JWT errors', () => {
        it('should return 401 with TOKEN_EXPIRED code if token is expired', async () => {
            jest.spyOn(refreshTokenService, 'execute').mockRejectedValueOnce(
                new jwt.TokenExpiredError('jwt expired', new Date()),
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(401)
            expect(response.body?.message).toBe('Unauthorized')
            expect(response.body?.code).toBe('TOKEN_EXPIRED')
        })

        it('should return 401 with INVALID_TOKEN code if token is malformed', async () => {
            jest.spyOn(refreshTokenService, 'execute').mockRejectedValueOnce(
                new jwt.JsonWebTokenError('invalid token'),
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(401)
            expect(response.body?.message).toBe('Unauthorized')
            expect(response.body?.code).toBe('INVALID_TOKEN')
        })

        it('should return 401 with INVALID_TOKEN code if token is not active yet (caught by JsonWebTokenError)', async () => {
            jest.spyOn(refreshTokenService, 'execute').mockRejectedValueOnce(
                new jwt.NotBeforeError('jwt not active', new Date()),
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(401)
            expect(response.body?.message).toBe('Unauthorized')
            expect(response.body?.code).toBe('INVALID_TOKEN')
        })
    })

    describe('application errors', () => {
        it('should return 401 if AppError is thrown', async () => {
            const appError = new UserNotFoundError('user123')
            jest.spyOn(refreshTokenService, 'execute').mockRejectedValueOnce(
                appError,
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(401)
            expect(response.body?.message).toBe('Unauthorized')
            expect(response.body?.code).toBe('USER_NOT_FOUND')
        })
    })

    describe('unexpected errors', () => {
        it('should return 500 if an unexpected error occurs', async () => {
            jest.spyOn(refreshTokenService, 'execute').mockRejectedValueOnce(
                new Error('Unexpected database error'),
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(500)
            expect(response.body?.message).toBe('Internal server error')
        })
    })

    describe('success cases', () => {
        it('should return 200 with new tokens when refresh is successful', async () => {
            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(201)
            expect(response.body?.data).toEqual(tokensGeneratorAdapterResponse)
            expect(response.body?.data?.accessToken).toBeDefined()
            expect(response.body?.data?.refreshToken).toBeDefined()
            expect(typeof response.body?.data?.accessToken).toBe('string')
            expect(typeof response.body?.data?.refreshToken).toBe('string')
        })

        it('should call RefreshTokenService with correct parameters', async () => {
            // arrange
            const spy = jest.spyOn(refreshTokenService, 'execute')

            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(spy).toHaveBeenCalledWith(baseHttpRequest.body.refreshToken)
            expect(spy).toHaveBeenCalledTimes(1)
        })
    })
})
