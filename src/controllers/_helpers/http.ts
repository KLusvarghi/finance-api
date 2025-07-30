import { HttpResponse } from '../../shared/types'

export const ok = <T = any>(data: T, message = 'Success'): HttpResponse<T> => ({
    statusCode: 200,
    body: {
        status: 'success',
        message,
        data,
    },
})

export const created = <T = any>(
    data: T,
    message = 'Created successfully',
): HttpResponse<T> => ({
    statusCode: 201,
    body: {
        status: 'success',
        message,
        data,
    },
})

export const noContent = (): HttpResponse => ({
    statusCode: 204,
    body: null,
})

export const badRequest = (
    message = 'Bad Request',
    data: any = null,
): HttpResponse => ({
    statusCode: 400,
    body: {
        status: 'error',
        message,
        data: data ?? undefined,
    },
})

export const unauthorized = (message = 'Unauthorized'): HttpResponse => ({
    statusCode: 401,
    body: {
        status: 'error',
        message,
    },
})

export const notFound = (message = 'Not Found'): HttpResponse => ({
    statusCode: 404,
    body: {
        status: 'error',
        message,
    },
})

export const serverError = (
    message = 'Internal server error',
): HttpResponse => ({
    statusCode: 500,
    body: {
        status: 'error',
        message,
    },
})
