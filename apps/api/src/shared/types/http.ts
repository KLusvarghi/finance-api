export interface HttpResponseBody<T = unknown> {
    success: boolean
    message: string
    code?: string
    data?: T
    details?: T
}

// More specific types for success and error responses
export interface HttpResponseSuccessBody<T = unknown> {
    success: true
    message: string
    data?: T
}

export interface HttpResponseErrorBody<T = unknown> {
    success: false
    message: string
    code: string
    details?: T
}

export type HttpResponse<T = unknown> = {
    statusCode: number
    body: HttpResponseSuccessBody<T> | HttpResponseErrorBody<T> | null
}

// Base types for HTTP request components
export type HttpRequestBody = Record<string, unknown> | unknown
export type HttpRequestParams = Record<string, string> | unknown
export type HttpRequestQuery = Record<string, string | string[]> | unknown
export type HttpRequestHeaders = Record<string, string> | unknown

export interface HttpRequest {
    body?: HttpRequestBody
    params?: HttpRequestParams
    query?: HttpRequestQuery
    headers?: HttpRequestHeaders
    userId?: string // userId from JWT token (set by auth middleware)
}
