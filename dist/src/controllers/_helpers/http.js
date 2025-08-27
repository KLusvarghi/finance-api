import { ResponseMessage } from '@/shared'
export const ok = (data, message = ResponseMessage.SUCCESS) => ({
    statusCode: 200,
    body: {
        message,
        data: data ?? null,
    },
})
export const created = (data, message = ResponseMessage.SUCCESS) => ({
    statusCode: 201,
    body: {
        message,
        data: data ?? null,
    },
})
export const noContent = () => ({
    statusCode: 204,
    body: null,
})
export const badRequest = (
    message = ResponseMessage.BAD_REQUEST,
    code,
    data,
) => ({
    statusCode: 400,
    body: {
        message,
        code,
        data: data ?? null,
    },
})
export const unauthorized = (message = ResponseMessage.ERROR, code, data) => ({
    statusCode: 401,
    body: {
        message,
        code,
        data: data ?? null,
    },
})
export const notFound = (message = ResponseMessage.NOT_FOUND, code, data) => ({
    statusCode: 404,
    body: {
        message,
        code,
        data: data ?? null,
    },
})
export const serverError = (
    message = ResponseMessage.SERVER_ERROR,
    code,
    data,
) => ({
    statusCode: 500,
    body: {
        message,
        code,
        data: data ?? null,
    },
})
//# sourceMappingURL=http.js.map
