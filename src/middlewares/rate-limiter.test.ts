import { NextFunction, Request, Response } from 'express'
import { RateLimiterRedis } from 'rate-limiter-flexible'

import { PresetName } from '../config/rate-limiter-presets'
import { logger } from '../shared/logger'
import { rateLimiter } from './rate-limiter'

// Mock variables
const mockConsume = jest.fn()

// Mock do módulo rate-limiter-flexible
jest.mock('rate-limiter-flexible', () => ({
    RateLimiterRedis: jest.fn().mockImplementation(() => ({
        consume: mockConsume,
    })),
}))

// Mock do módulo de configuração do Redis
jest.mock('../config/redis', () => ({
    redis: {},
}))

// Mock do logger estruturado
jest.mock('../shared/logger', () => ({
    logger: {
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
    },
}))

describe('Rate Limiter Middleware', () => {
    let req: Partial<Request>
    let res: Partial<Response>
    let next: NextFunction
    let mockSetHeader: jest.Mock
    let mockStatus: jest.Mock
    let mockJson: jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()

        mockSetHeader = jest.fn()
        mockStatus = jest.fn().mockReturnThis()
        mockJson = jest.fn().mockReturnThis()

        req = {
            ip: '127.0.0.1',
            user: undefined,
            get: jest.fn().mockReturnValue('Mozilla/5.0'),
        }

        res = {
            setHeader: mockSetHeader,
            status: mockStatus,
            json: mockJson,
        }

        next = jest.fn()

        // Reset mocks
        mockConsume.mockReset()
        ;(
            RateLimiterRedis as jest.MockedClass<typeof RateLimiterRedis>
        ).mockClear()

        // Configuração padrão de sucesso (happy path)
        mockConsume.mockResolvedValue({
            remainingPoints: 5,
            msBeforeNext: 60000,
            isFirstInDuration: true,
            consumedPoints: 1,
            toJSON: () => ({}),
        })

        delete process.env.RATE_LIMITER_SHADOW_MODE
    })

    describe('basic functionality', () => {
        it('should export rateLimiter function', () => {
            expect(typeof rateLimiter).toBe('function')
        })

        it('should return a middleware function when called', () => {
            const middleware = rateLimiter('public')
            expect(typeof middleware).toBe('function')
        })
    })

    describe('successful rate limiting', () => {
        it('should allow request when under rate limit and set correct headers', async () => {
            // arrange
            const middleware = rateLimiter('public')
            mockConsume.mockResolvedValue({
                remainingPoints: 95,
                msBeforeNext: 45000,
                isFirstInDuration: false,
                consumedPoints: 5,
                toJSON: () => ({}),
            })

            // act
            await middleware(req as Request, res as Response, next)

            // assert
            expect(mockConsume).toHaveBeenCalledWith('127.0.0.1')
            expect(mockSetHeader).toHaveBeenCalledWith('RateLimit-Limit', 100)
            expect(mockSetHeader).toHaveBeenCalledWith(
                'RateLimit-Remaining',
                95,
            )
            expect(mockSetHeader).toHaveBeenCalledWith(
                'RateLimit-Reset',
                expect.any(String),
            )
            expect(next).toHaveBeenCalled()
            expect(mockStatus).not.toHaveBeenCalled()
        })

        it('should use different key generators for different presets', async () => {
            // arrange - test auth preset with user
            req.user = { id: 'user-123' }
            const middleware = rateLimiter('auth')

            // act
            await middleware(req as Request, res as Response, next)

            // assert
            expect(mockConsume).toHaveBeenCalledWith('user:user-123')
            expect(next).toHaveBeenCalled()
        })

        it('should fallback to IP when user is not available in auth preset', async () => {
            // arrange
            const middleware = rateLimiter('auth')

            // act
            await middleware(req as Request, res as Response, next)

            // assert
            expect(mockConsume).toHaveBeenCalledWith('127.0.0.1')
            expect(next).toHaveBeenCalled()
        })
    })

    describe('rate limit exceeded', () => {
        it('should return 429 when rate limit is exceeded', async () => {
            // arrange
            const middleware = rateLimiter('strict')
            const rejectionError = {
                msBeforeNext: 900000, // 15 minutes
            }
            mockConsume.mockRejectedValue(rejectionError)

            // act
            await middleware(req as Request, res as Response, next)

            // assert
            expect(mockSetHeader).toHaveBeenCalledWith('RateLimit-Limit', 5)
            expect(mockSetHeader).toHaveBeenCalledWith('RateLimit-Remaining', 0)
            expect(mockSetHeader).toHaveBeenCalledWith('Retry-After', 900)
            expect(mockStatus).toHaveBeenCalledWith(429)
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Too Many Requests',
                message: 'Rate limit exceeded. Please try again later.',
                retryAfter: 900,
            })
            expect(next).not.toHaveBeenCalled()
        })

        it('should set minimum retry after of 1 second', async () => {
            // arrange
            const middleware = rateLimiter('public')
            const rejectionError = {
                msBeforeNext: 500, // Less than 1 second
            }
            mockConsume.mockRejectedValue(rejectionError)

            // act
            await middleware(req as Request, res as Response, next)

            // assert
            expect(mockSetHeader).toHaveBeenCalledWith('Retry-After', 1)
        })
    })

    describe('shadow mode', () => {
        beforeEach(() => {
            process.env.RATE_LIMITER_SHADOW_MODE = 'true'
        })

        it('should allow request even when rate limit is exceeded in shadow mode', async () => {
            // arrange
            const middleware = rateLimiter('strict')
            const rejectionError = {
                msBeforeNext: 900000,
            }
            mockConsume.mockRejectedValue(rejectionError)

            // act
            await middleware(req as Request, res as Response, next)

            // assert
            expect(logger.warn).toHaveBeenCalledWith(
                'Rate limit exceeded for key: 127.0.0.1, preset: strict',
                expect.objectContaining({
                    key: '127.0.0.1',
                    preset: 'strict',
                    ip: '127.0.0.1',
                    userAgent: 'Mozilla/5.0',
                    retryAfter: 900,
                    shadowMode: true,
                }),
            )
            expect(next).toHaveBeenCalled()
            expect(mockStatus).not.toHaveBeenCalled()
        })

        it('should allow request and log when Redis fails in shadow mode', async () => {
            // arrange
            const middleware = rateLimiter('public')
            const redisError = new Error('Redis connection failed')
            mockConsume.mockRejectedValue(redisError)

            // act
            await middleware(req as Request, res as Response, next)

            // assert
            expect(logger.error).toHaveBeenCalledWith(
                'Rate limiter error',
                expect.objectContaining({
                    preset: 'public',
                    ip: '127.0.0.1',
                    userAgent: 'Mozilla/5.0',
                    error: 'Redis connection failed',
                    stack: expect.any(String),
                }),
            )
            expect(logger.warn).toHaveBeenCalledWith(
                'Rate limiter infrastructure error in shadow mode',
                expect.objectContaining({
                    preset: 'public',
                    ip: '127.0.0.1',
                    userAgent: 'Mozilla/5.0',
                    error: 'Redis connection failed',
                    shadowMode: true,
                }),
            )
            expect(next).toHaveBeenCalled()
            expect(mockStatus).not.toHaveBeenCalled()
        })
    })

    describe('infrastructure failures', () => {
        it('should return 503 when Redis fails and not in shadow mode', async () => {
            // arrange
            const middleware = rateLimiter('public')
            const redisError = new Error('Redis connection failed')
            mockConsume.mockRejectedValue(redisError)

            // act
            await middleware(req as Request, res as Response, next)

            // assert
            expect(logger.error).toHaveBeenCalledWith(
                'Rate limiter error',
                expect.objectContaining({
                    preset: 'public',
                    ip: '127.0.0.1',
                    userAgent: 'Mozilla/5.0',
                    error: 'Redis connection failed',
                    stack: expect.any(String),
                }),
            )
            expect(mockStatus).toHaveBeenCalledWith(503)
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Service Temporarily Unavailable',
                message:
                    'Rate limiting service is temporarily unavailable. Please try again later.',
            })
            expect(next).not.toHaveBeenCalled()
        })

        it('should handle unknown errors gracefully', async () => {
            // arrange
            const middleware = rateLimiter('public')
            mockConsume.mockRejectedValue('Unknown error')

            // act
            await middleware(req as Request, res as Response, next)

            // assert
            expect(logger.error).toHaveBeenCalledWith(
                'Rate limiter error',
                expect.objectContaining({
                    preset: 'public',
                    ip: '127.0.0.1',
                    userAgent: 'Mozilla/5.0',
                    error: 'Unknown error',
                    stack: undefined,
                }),
            )
            expect(mockStatus).toHaveBeenCalledWith(503)
        })
    })

    describe('different presets', () => {
        it.each([
            ['public', 100, '127.0.0.1'],
            ['auth', 50, '127.0.0.1'],
            ['strict', 5, '127.0.0.1'],
            ['default', 200, '127.0.0.1'],
        ])(
            'should use correct configuration for %s preset',
            async (presetName, expectedPoints, expectedKey) => {
                // arrange
                const middleware = rateLimiter(presetName as PresetName)

                // act
                await middleware(req as Request, res as Response, next)

                // assert
                expect(mockConsume).toHaveBeenCalledWith(expectedKey)
                expect(mockSetHeader).toHaveBeenCalledWith(
                    'RateLimit-Limit',
                    expectedPoints,
                )
            },
        )
    })

    describe('instance caching', () => {
        it('should work with multiple calls to same preset', async () => {
            // arrange
            const middleware = rateLimiter('public')

            // act
            await middleware(req as Request, res as Response, next)
            await middleware(req as Request, res as Response, next)

            // assert
            // Should call consume twice with same key
            expect(mockConsume).toHaveBeenCalledTimes(2)
            expect(mockConsume).toHaveBeenNthCalledWith(1, '127.0.0.1')
            expect(mockConsume).toHaveBeenNthCalledWith(2, '127.0.0.1')
            expect(next).toHaveBeenCalledTimes(2)
        })

        it('should work with different presets', async () => {
            // arrange
            const publicMiddleware = rateLimiter('public')
            const strictMiddleware = rateLimiter('strict')

            // act
            await publicMiddleware(req as Request, res as Response, next)
            await strictMiddleware(req as Request, res as Response, next)

            // assert
            // Both should work correctly with their respective configurations
            expect(mockConsume).toHaveBeenCalledTimes(2)
            expect(mockSetHeader).toHaveBeenCalledWith('RateLimit-Limit', 100) // public preset
            expect(mockSetHeader).toHaveBeenCalledWith('RateLimit-Limit', 5) // strict preset
            expect(next).toHaveBeenCalledTimes(2)
        })
    })
})
