/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorCode } from '@/errors'
import { HttpResponse, ResponseMessage } from '@/shared'

/**
 * Creates a standard success response body.
 * Omits the 'data' key if data is not provided.
 */
const createSuccessBody = <T>(message: string, data?: T) => {
    const body: any = {
        success: true,
        message,
    }

    if (data) {
        body.data = data
    }

    return body
}

/**
 * Creates a standard error response body.
 * Omits the 'details' key if details are not provided.
 */
const createErrorBody = <T>(message: string, code?: string, details?: T) => {
    const body: any = {
        success: false,
        message,
        code: code || ErrorCode.INTERNAL_SERVER_ERROR, // Ensure a code is always present for errors
    }

    if (details) {
        body.details = details
    }

    return body
}

export const ok = <T = any>(
    data?: T,
    message: string = ResponseMessage.SUCCESS,
): HttpResponse<T> => ({
    statusCode: 200,
    body: createSuccessBody(message, data),
})

export const created = <T = any>(
    data?: T,
    message: string = ResponseMessage.SUCCESS,
): HttpResponse<T> => ({
    statusCode: 201,
    body: createSuccessBody(message, data),
})

/**
 * Note: While HTTP 204 is a valid response, it cannot contain a body.
 * For API consistency, PREFER using ok() with a success message
 * instead of noContent() for operations like DELETE.
 * This ensures the client always receives a predictable JSON response.
 */
export const noContent = (): HttpResponse<null> => ({
    statusCode: 204,
    body: null,
})

export const badRequest = <T = any>(
    message: string = ResponseMessage.BAD_REQUEST,
    code?: string,
    details?: T,
): HttpResponse<T> => ({
    statusCode: 400,
    body: createErrorBody(message, code || ErrorCode.BAD_REQUEST, details),
})

export const unauthorized = <T = any>(
    message: string = ResponseMessage.UNAUTHORIZED,
    code?: string,
    details?: T,
): HttpResponse<T> => ({
    statusCode: 401,
    body: createErrorBody(message, code || ErrorCode.UNAUTHORIZED, details),
})

export const forbidden = <T = any>(
    message: string = ResponseMessage.FORBIDDEN,
    details?: T,
): HttpResponse<T> => ({
    statusCode: 403,
    body: createErrorBody(message, ErrorCode.FORBIDDEN, details),
})

export const notFound = <T = any>(
    message: string = ResponseMessage.NOT_FOUND,
    code?: string,
    details?: T,
): HttpResponse<T> => ({
    statusCode: 404,
    body: createErrorBody(message, code || ErrorCode.NOT_FOUND, details),
})

export const serverError = <T = any>(
    message: string = ResponseMessage.SERVER_ERROR,
    details?: any,
): HttpResponse<T> => ({
    statusCode: 500,
    body: createErrorBody(message, ErrorCode.INTERNAL_SERVER_ERROR, details),
})
