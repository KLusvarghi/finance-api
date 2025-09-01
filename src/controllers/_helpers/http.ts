/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorCode } from '@/errors'
import { HttpResponse, ResponseMessage } from '@/shared'

export const ok = <T = any>(
    data: T,
    message: string = ResponseMessage.SUCCESS,
): HttpResponse<T> => ({
    statusCode: 200,
    body: {
        message,
        data: data ?? null,
    },
})

export const created = <T = any>(
    data: T,
    message: string = ResponseMessage.SUCCESS,
): HttpResponse<T> => ({
    statusCode: 201,
    body: {
        message,
        data: data ?? null,
    },
})

export const noContent = (): HttpResponse<null> => ({
    statusCode: 204,
    body: null,
})

export const badRequest = <T = any>(
    message: string = ResponseMessage.BAD_REQUEST,
    code?: string,
    data?: T,
): HttpResponse<T> => ({
    statusCode: 400,
    body: {
        message,
        code,
        data: data ?? null,
    },
})

export const unauthorized = <T = any>(
    code?: string,
    data?: T,
): HttpResponse<T> => ({
    statusCode: 401,
    body: {
        message: ResponseMessage.UNAUTHORIZED,
        code,
        data: data ?? null,
    },
})

export const forbidden = <T = any>(): HttpResponse<T> => ({
    statusCode: 403,
    body: {
        message: ResponseMessage.FORBIDDEN,
        code: ErrorCode.FORBIDDEN,
    },
})

export const notFound = <T = any>(
    message: string = ResponseMessage.NOT_FOUND,
    code?: string,
    data?: T,
): HttpResponse<T> => ({
    statusCode: 404,
    body: {
        message,
        code,
        data: data ?? null,
    },
})

export const serverError = <T = any>(
    message: string = ResponseMessage.SERVER_ERROR,
    code?: string,
    data?: T,
): HttpResponse<T> => ({
    statusCode: 500,
    body: {
        message,
        code,
        data: data ?? null,
    },
})
