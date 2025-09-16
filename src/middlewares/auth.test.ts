import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'

import { auth, AuthenticatedRequest } from './auth'

import { userIdSchema } from '@/schemas'
import { invalidTokenCases } from '@/test'

// Mock jsonwebtoken module
jest.mock('jsonwebtoken')

// Mock the userIdSchema
jest.mock('@/schemas', () => ({
    userIdSchema: {
        parseAsync: jest.fn(),
    },
}))

// Mock console.error to keep test output clean
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation()

describe('Auth Middleware', () => {
    let mockRequest: Partial<AuthenticatedRequest>
    let mockResponse: Partial<Response>
    let mockNext: NextFunction

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks()

        // Setup mock request, response, and next function
        mockRequest = {
            headers: {},
        }

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        }

        mockNext = jest.fn()
    })

    afterAll(() => {
        // Restore console.error after all tests
        mockConsoleError.mockRestore()
    })

    describe('success', () => {
        it('should call next() and attach userId to request if token is valid', async () => {
            // arrange
            const validToken = 'valid.jwt.token'
            const userId = 'test-user-id'

            mockRequest.headers = {
                authorization: `Bearer ${validToken}`,
            }

            // Mock jwt.verify to not throw an error (valid token)
            const mockJwtVerify = jest.mocked(jwt.verify)
            mockJwtVerify.mockImplementation(() => {
                // jwt.verify doesn't throw, meaning token is valid
                return {}
            })

            // Mock jwt.decode to return a valid payload
            const mockJwtDecode = jest.mocked(jwt.decode)
            mockJwtDecode.mockReturnValue({ userId })

            // Mock userIdSchema.parseAsync to return the userId
            const mockUserIdSchema = jest.mocked(userIdSchema.parseAsync)
            mockUserIdSchema.mockResolvedValue(userId)

            // act
            await auth(
                mockRequest as AuthenticatedRequest,
                mockResponse as Response,
                mockNext,
            )

            // assert
            expect(mockJwtVerify).toHaveBeenCalledWith(
                validToken,
                process.env.JWT_ACCESS_SECRET,
            )
            expect(mockJwtDecode).toHaveBeenCalledWith(validToken)
            expect(mockUserIdSchema).toHaveBeenCalledWith(userId)
            expect(mockRequest.userId).toBe(userId)
            expect(mockNext).toHaveBeenCalledTimes(1)
            expect(mockResponse.status).not.toHaveBeenCalled()
            expect(mockResponse.send).not.toHaveBeenCalled()
        })
    })

    describe('error handling', () => {
        it.each(invalidTokenCases)(
            'should return 401 if $description',
            async ({ token }) => {
                // arrange
                if (token === undefined || token === null) {
                    mockRequest.headers = {}
                } else {
                    mockRequest.headers = {
                        authorization: token,
                    }
                }

                // Mock jwt.verify to throw an error for invalid tokens
                const mockJwtVerify = jest.mocked(jwt.verify)
                mockJwtVerify.mockImplementation(() => {
                    throw new Error('Invalid token')
                })

                // act
                await auth(
                    mockRequest as AuthenticatedRequest,
                    mockResponse as Response,
                    mockNext,
                )

                // assert
                expect(mockResponse.status).toHaveBeenCalledWith(401)
                expect(mockResponse.send).toHaveBeenCalledWith({
                    message: 'Unauthorized',
                })
                expect(mockNext).not.toHaveBeenCalled()
            },
        )

        it('should return 401 if userId validation fails', async () => {
            // arrange
            const validToken = 'valid.jwt.token'

            mockRequest.headers = {
                authorization: `Bearer ${validToken}`,
            }

            // Mock jwt.verify to not throw an error (valid token)
            const mockJwtVerify = jest.mocked(jwt.verify)
            mockJwtVerify.mockImplementation(() => {
                return {}
            })

            // Mock jwt.decode to return an invalid payload (no userId)
            const mockJwtDecode = jest.mocked(jwt.decode)
            mockJwtDecode.mockReturnValue({})

            // Mock userIdSchema.parseAsync to return undefined (validation fails)
            const mockUserIdSchema = jest.mocked(userIdSchema.parseAsync)
            mockUserIdSchema.mockResolvedValue(undefined as unknown as string)

            // act
            await auth(
                mockRequest as AuthenticatedRequest,
                mockResponse as Response,
                mockNext,
            )

            // assert
            expect(mockResponse.status).toHaveBeenCalledWith(401)
            expect(mockResponse.send).toHaveBeenCalledWith({
                message: 'Unauthorized',
            })
            expect(mockNext).not.toHaveBeenCalled()
        })

        it('should return 401 and log error when jwt.verify throws an error', async () => {
            // arrange
            const invalidToken = 'invalid.jwt.token'
            const jwtError = new Error('JsonWebTokenError: invalid signature')

            mockRequest.headers = {
                authorization: `Bearer ${invalidToken}`,
            }

            // Mock jwt.verify to throw an error
            const mockJwtVerify = jest.mocked(jwt.verify)
            mockJwtVerify.mockImplementation(() => {
                throw jwtError
            })

            // act
            await auth(
                mockRequest as AuthenticatedRequest,
                mockResponse as Response,
                mockNext,
            )

            // assert
            expect(mockConsoleError).toHaveBeenCalledWith(jwtError)
            expect(mockResponse.status).toHaveBeenCalledWith(401)
            expect(mockResponse.send).toHaveBeenCalledWith({
                message: 'Unauthorized',
            })
            expect(mockNext).not.toHaveBeenCalled()
        })
    })
})
