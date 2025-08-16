export const ok = (data, message = 'Success') => ({
    statusCode: 200,
    body: {
        status: 'success',
        message,
        data,
    },
});
export const created = (data, message = 'Created successfully') => ({
    statusCode: 201,
    body: {
        status: 'success',
        message,
        data,
    },
});
export const noContent = () => ({
    statusCode: 204,
    body: null,
});
export const badRequest = (message = 'Bad Request', data = null) => ({
    statusCode: 400,
    body: {
        status: 'error',
        message,
        data: data ?? undefined,
    },
});
export const unauthorized = (message = 'Unauthorized') => ({
    statusCode: 401,
    body: {
        status: 'error',
        message,
    },
});
export const notFound = (message = 'Not Found') => ({
    statusCode: 404,
    body: {
        status: 'error',
        message,
    },
});
export const serverError = (message = 'Internal server error') => ({
    statusCode: 500,
    body: {
        status: 'error',
        message,
    },
});
//# sourceMappingURL=http.js.map