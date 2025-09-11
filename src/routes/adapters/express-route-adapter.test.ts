import { NextFunction, Request, Response } from 'express'

import { adaptRoute } from './express-route-adapter'

import { HttpRequest, HttpResponse } from '@/shared'

// Generic controller interface for testing (matching the adapter's interface)
interface GenericController {
    execute(
        httpRequest: HttpRequest,
    ): Promise<{ statusCode: number; body: unknown }>
}

// Mock controller for testing
class MockController implements GenericController {
    constructor(private readonly mockResponse: HttpResponse) {}

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        return this.mockResponse
    }
}

// Mock controller that throws an error
class MockErrorController implements GenericController {
    constructor(private readonly error: Error) {}

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        throw this.error
    }
}

describe('adaptRoute', () => {
    let mockRequest: Partial<Request>
    let mockResponse: Partial<Response>
    let mockNext: NextFunction
    let statusSpy: jest.SpyInstance
    let jsonSpy: jest.SpyInstance

    beforeEach(() => {
        mockRequest = {
            body: { name: 'John Doe' },
            params: { id: '123' },
            query: { page: '1' },
            headers: { authorization: 'Bearer token' },
            // userId is added by auth middleware, not part of Express Request
        } as unknown as Request

        statusSpy = jest.fn().mockReturnThis()
        jsonSpy = jest.fn()

        mockResponse = {
            status: statusSpy,
            json: jsonSpy,
        } as unknown as Response

        mockNext = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('success scenarios', () => {
        it('should execute controller and send response correctly', async () => {
            // arrange
            const mockHttpResponse: HttpResponse = {
                statusCode: 200,
                body: {
                    success: true,
                    message: 'Success',
                    data: { id: '123', name: 'John Doe' },
                },
            }

            const mockController = new MockController(mockHttpResponse)
            const adaptedRoute = adaptRoute(mockController)

            // act
            await adaptedRoute(
                mockRequest as Request,
                mockResponse as Response,
                mockNext,
            )

            // assert
            expect(statusSpy).toHaveBeenCalledWith(200)
            expect(jsonSpy).toHaveBeenCalledWith({
                success: true,
                message: 'Success',
                data: { id: '123', name: 'John Doe' },
            })
            expect(mockNext).not.toHaveBeenCalled()
        })

        it('should map Express request to HttpRequest correctly', async () => {
            // arrange
            const mockHttpResponse: HttpResponse = {
                statusCode: 201,
                body: { success: true, message: 'Created' },
            }

            let capturedHttpRequest: HttpRequest | null = null

            class CapturingController implements GenericController {
                async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
                    capturedHttpRequest = httpRequest
                    return mockHttpResponse
                }
            }

            const mockController = new CapturingController()
            const adaptedRoute = adaptRoute(mockController)

            // act
            await adaptedRoute(
                mockRequest as Request,
                mockResponse as Response,
                mockNext,
            )

            // assert
            expect(capturedHttpRequest).toEqual({
                body: { name: 'John Doe' },
                params: { id: '123' },
                query: { page: '1' },
                headers: { authorization: 'Bearer token' },
                userId: undefined, // userId is not set in this test
            })
        })
    })

    describe('error scenarios', () => {
        it('should call next with error when controller throws', async () => {
            // arrange
            const mockError = new Error('Controller error')
            const mockController = new MockErrorController(mockError)
            const adaptedRoute = adaptRoute(mockController)

            // act
            await adaptedRoute(
                mockRequest as Request,
                mockResponse as Response,
                mockNext,
            )

            // assert
            expect(mockNext).toHaveBeenCalledWith(mockError)
            expect(statusSpy).not.toHaveBeenCalled()
            expect(jsonSpy).not.toHaveBeenCalled()
        })

        it('should call next with error when controller rejects', async () => {
            // arrange
            const mockError = new Error('Async controller error')

            class AsyncErrorController implements GenericController {
                async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
                    return Promise.reject(mockError)
                }
            }

            const mockController = new AsyncErrorController()
            const adaptedRoute = adaptRoute(mockController)

            // act
            await adaptedRoute(
                mockRequest as Request,
                mockResponse as Response,
                mockNext,
            )

            // assert
            expect(mockNext).toHaveBeenCalledWith(mockError)
            expect(statusSpy).not.toHaveBeenCalled()
            expect(jsonSpy).not.toHaveBeenCalled()
        })
    })
})
