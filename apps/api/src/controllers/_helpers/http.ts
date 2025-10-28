import { ErrorCode } from '@/errors'
import {
    HttpResponse,
    HttpResponseErrorBody,
    HttpResponseSuccessBody,
    ResponseMessage,
} from '@/shared'

interface SuccessBodyWithData<T> {
    success: true
    message: string
    data: T
}

interface SuccessBodyWithoutData {
    success: true
    message: string
}

interface ErrorBodyWithDetails<T> {
    success: false
    message: string
    code: string
    details: T
}

interface ErrorBodyWithoutDetails {
    success: false
    message: string
    code: string
}

type SuccessBody<T> = T extends undefined
    ? SuccessBodyWithoutData
    : SuccessBodyWithData<T>

type ErrorBody<T> = T extends undefined
    ? ErrorBodyWithoutDetails
    : ErrorBodyWithDetails<T>

/**
 * Creates a standard success response body.
 * Omits the 'data' key if data is not provided.
 */
const createSuccessBody = <T>(message: string, data?: T): SuccessBody<T> => {
    const baseBody = {
        success: true as const,
        message,
    }

    if (data !== undefined) {
        return {
            ...baseBody,
            data,
        } as SuccessBody<T>
    }

    return baseBody as SuccessBody<T>
}

/**
 * Creates a standard error response body.
 * Omits the 'details' key if details are not provided.
 */
const createErrorBody = <T>(
    message: string,
    code?: string,
    details?: T,
): ErrorBody<T> => {
    const baseBody = {
        success: false as const,
        message,
        code: code || ErrorCode.INTERNAL_SERVER_ERROR,
    }

    if (details !== undefined) {
        return {
            ...baseBody,
            details,
        } as ErrorBody<T>
    }

    return baseBody as ErrorBody<T>
}

export const ok = <T = undefined>(
    data?: T,
    message: string = ResponseMessage.SUCCESS,
): HttpResponse<T> => ({
    statusCode: 200,
    body: createSuccessBody(message, data) as HttpResponseSuccessBody<T>,
})

export const created = <T = undefined>(
    data?: T,
    message: string = ResponseMessage.SUCCESS,
): HttpResponse<T> => ({
    statusCode: 201,
    body: createSuccessBody(message, data) as HttpResponseSuccessBody<T>,
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

export const badRequest = <T = undefined>(
    message: string = ResponseMessage.BAD_REQUEST,
    code?: string,
    details?: T,
): HttpResponse<T> => ({
    statusCode: 400,
    body: createErrorBody(
        message,
        code || ErrorCode.BAD_REQUEST,
        details,
    ) as HttpResponseErrorBody<T>,
})

export const unauthorized = <T = undefined>(
    message: string = ResponseMessage.UNAUTHORIZED,
    code?: string,
    details?: T,
): HttpResponse<T> => ({
    statusCode: 401,
    body: createErrorBody(
        message,
        code || ErrorCode.UNAUTHORIZED,
        details,
    ) as HttpResponseErrorBody<T>,
})

export const forbidden = <T = undefined>(
    message: string = ResponseMessage.FORBIDDEN,
    details?: T,
): HttpResponse<T> => ({
    statusCode: 403,
    body: createErrorBody(
        message,
        ErrorCode.FORBIDDEN,
        details,
    ) as HttpResponseErrorBody<T>,
})

export const notFound = <T = undefined>(
    message: string = ResponseMessage.NOT_FOUND,
    code?: string,
    details?: T,
): HttpResponse<T> => ({
    statusCode: 404,
    body: createErrorBody(
        message,
        code || ErrorCode.NOT_FOUND,
        details,
    ) as HttpResponseErrorBody<T>,
})

export const serverError = <T = undefined>(
    message: string = ResponseMessage.SERVER_ERROR,
    details?: T,
): HttpResponse<T> => ({
    statusCode: 500,
    body: createErrorBody(
        message,
        ErrorCode.INTERNAL_SERVER_ERROR,
        details,
    ) as HttpResponseErrorBody<T>,
})
