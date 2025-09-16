import { HttpRequest, HttpResponse } from './http'

export interface Controller<TRequest = unknown, TResponse = unknown> {
    execute(
        httpRequest: HttpRequest & { body: TRequest },
    ): Promise<HttpResponse<TResponse>>
}

export interface BodyController<TBody = unknown, TResponse = unknown> {
    execute(
        httpRequest: HttpRequest & { body: TBody },
    ): Promise<HttpResponse<TResponse>>
}

export interface ParamsController<TParams = unknown, TResponse = unknown> {
    execute(
        httpRequest: HttpRequest & { params: TParams },
    ): Promise<HttpResponse<TResponse>>
}

export interface HeadersController<THeaders = unknown, TResponse = unknown> {
    execute(
        httpRequest: HttpRequest & { headers: THeaders },
    ): Promise<HttpResponse<TResponse>>
}

export interface BodyParamsController<
    TBody = unknown,
    TParams = unknown,
    TResponse = unknown,
> {
    execute(
        httpRequest: HttpRequest & { body: TBody; params: TParams },
    ): Promise<HttpResponse<TResponse>>
}

export interface BodyHeadersController<
    TBody = unknown,
    THeaders = unknown,
    TResponse = unknown,
> {
    execute(
        httpRequest: HttpRequest & { body: TBody; headers: THeaders },
    ): Promise<HttpResponse<TResponse>>
}

export interface ParamsHeadersController<
    TParams = unknown,
    THeaders = unknown,
    TResponse = unknown,
> {
    execute(
        httpRequest: HttpRequest & { params: TParams; headers: THeaders },
    ): Promise<HttpResponse<TResponse>>
}

export interface BodyParamsHeadersController<
    TBody = unknown,
    TParams = unknown,
    THeaders = unknown,
    TResponse = unknown,
> {
    execute(
        httpRequest: HttpRequest & {
            body: TBody
            params: TParams
            headers: THeaders
        },
    ): Promise<HttpResponse<TResponse>>
}
