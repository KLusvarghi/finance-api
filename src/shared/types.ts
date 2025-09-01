/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Prisma } from '@prisma/client'

// ============================================================================
// HTTP RESPONSE TYPES
// ============================================================================

export interface HttpResponseBody<T = unknown> {
    message: string
    code?: string
    data?: T | null
}

export type HttpResponse<T = unknown> = {
    statusCode: number
    body: HttpResponseBody<T> | null
}

// ============================================================================
// REPOSITORY RESPONSE TYPES
// ============================================================================

// User Repository Responses
export type UserRepositoryResponse = Prisma.UserGetPayload<
    Record<string, never>
>

// Transaction Repository Responses
export type TransactionRepositoryResponse = Prisma.TransactionGetPayload<
    Record<string, never>
>

// Custom Repository Responses
export interface UserBalanceRepositoryResponse {
    earnings: string
    expenses: string
    investments: string
    balance: string
}

// ============================================================================
// PUBLIC RESPONSE TYPES (without sensitive data)
// ============================================================================

export interface UserPublicResponse {
    id: string
    first_name: string
    last_name: string
    email: string
}

export interface TransactionPublicResponse {
    id: string
    userId: string
    name: string
    amount: Prisma.Decimal
    date: Date
    type: Prisma.TransactionGetPayload<Record<string, never>>['type']
}

// ============================================================================
// USER PARAMETER TYPES
// ============================================================================

export interface CreateUserParams {
    first_name: string
    last_name: string
    email: string
    password: string
}

export interface UpdateUserParams {
    first_name?: string
    last_name?: string
    email?: string
    password?: string
}

export interface UserIdRequestParams {
    userId: string
}

export interface TransactionIdRequestParams {
    transactionId: string
}

export interface HeadersRequestParams {
    headers: UserIdRequestParams
}

export interface LoginUserRequestParams {
    email: string
    password: string
}

// ============================================================================
// CONTROLLER REQUEST TYPES
// ============================================================================

// User Controller Request Types

export interface CreateUserRequest {
    body: CreateUserParams
}

export interface DeleteUserRequest extends HeadersRequestParams {}

export interface GetUserBalanceRequest extends HeadersRequestParams {}

export interface GetUserByIdRequest extends HeadersRequestParams {}

export interface LoginUserRequest {
    body: LoginUserRequestParams
}

export interface UpdateUserRequest extends HeadersRequestParams {
    body: UpdateUserParams
}

// Transaction Controller Request Types
export interface CreateTransactionRequest extends HeadersRequestParams {
    body: CreateTransactionParams
}

export interface DeleteTransactionRequest extends HeadersRequestParams {
    params: DeleteTransactionParams
}

export interface GetTransactionsByUserIdRequest extends HeadersRequestParams {}

export interface UpdateTransactionRequest extends HeadersRequestParams {
    body: UpdateTransactionParams
    params: TransactionIdRequestParams
}

// ============================================================================
// USER HTTP REQUEST TYPES
// ============================================================================

export interface UserHttpRequest {
    first_name: string
    last_name: string
    email: string
    password: string
}

// ============================================================================
// TRANSACTION PARAMETER TYPES
// ============================================================================

export interface CreateTransactionParams {
    name: string
    amount: number
    date: string
    type: 'EARNING' | 'EXPENSE' | 'INVESTMENT'
}

export interface CreateTransactionServiceParams
    extends CreateTransactionParams {
    userId: string
}

export interface UpdateTransactionParams {
    name?: string
    amount?: number
    date?: string
    type?: 'EARNING' | 'EXPENSE' | 'INVESTMENT'
}

export interface UpdateTransactionServiceParams
    extends UpdateTransactionParams {
    userId: string
}

export interface DeleteTransactionParams {
    transactionId: string
}
export interface DeleteTransactionServiceParams
    extends DeleteTransactionParams {
    userId: string
}

// ============================================================================
// REPOSITORY INTERFACE TYPES
// ============================================================================

// User
export interface CreateUserRepository {
    execute(
        user: CreateUserParams & { id: string; password: string },
    ): Promise<UserRepositoryResponse>
}

export interface GetUserByIdRepository {
    execute(userId: string): Promise<UserRepositoryResponse | null>
}

export interface GetUserByEmailRepository {
    execute(email: string): Promise<UserRepositoryResponse | null>
}

export interface UpdateUserRepository {
    execute(
        userId: string,
        user: UpdateUserParams,
    ): Promise<UserRepositoryResponse | null>
}

export interface DeleteUserRepository {
    execute(userId: string): Promise<UserRepositoryResponse | null>
}

export interface GetUserBalanceRepository {
    execute(userId: string): Promise<UserBalanceRepositoryResponse>
}
// Transaction
export interface CreateTransactionRepository {
    execute(
        params: CreateTransactionServiceParams & { id: string },
    ): Promise<TransactionRepositoryResponse>
}

export interface GetTransactionsByUserIdRepository {
    execute(userId: string): Promise<TransactionRepositoryResponse[]>
}

export interface GetTransactionByIdRepository {
    execute(transaction: string): Promise<TransactionRepositoryResponse | null>
}

export interface GetTransactionByUserIdRepository {
    execute(
        transactionId: string,
    ): Promise<TransactionRepositoryResponse | null>
}

export interface UpdateTransactionRepository {
    execute(
        transactionId: string,
        params: UpdateTransactionParams,
    ): Promise<TransactionRepositoryResponse | null>
}

export interface DeleteTransactionRepository {
    execute(
        transactionId: string,
    ): Promise<TransactionRepositoryResponse | null>
}

// ============================================================================
// SERVICE PARAMETER TYPES
// ============================================================================

export interface UpdateUserServiceParams {
    userId: string
    updateUserParams: UpdateUserParams
}

// ============================================================================
// CONTROLLER INTERFACE TYPES
// ============================================================================

// User Service Interfaces
// export type CreateUserService = Service<CreateUserParams, UserPublicResponse>

// export type GetUserByIdService = SimpleService<string, UserPublicResponse>

// export type GetUserBalanceService = SimpleService<
//     string,
//     UserBalanceRepositoryResponse
// >

// export type UpdateUserService = ServiceWithMultipleParams<
//     string,
//     UpdateUserParams,
//     unknown,
//     UserPublicResponse
// >

// export type DeleteUserService = SimpleService<string, UserPublicResponse>

// // Transaction Service Interfaces
// export type CreateTransactionService = Service<
//     CreateTransactionParams,
//     TransactionPublicResponse
// >

// export type GetTransactionsByUserIdService = SimpleService<
//     string,
//     TransactionPublicResponse[]
// >

// export type UpdateTransactionService = ServiceWithMultipleParams<
//     string,
//     UpdateTransactionParams,
//     unknown,
//     TransactionPublicResponse
// >

// export type DeleteTransactionService = ServiceWithMultipleParams<
//     string,
//     unknown,
//     TransactionPublicResponse
// >

// ============================================================================
// SERVICE INTERFACE TYPES
// ============================================================================

// User
export interface CreateUserService {
    execute(params: CreateUserParams): Promise<UserPublicResponse>
}

export interface GetUserByIdService {
    execute(userId: string): Promise<UserPublicResponse>
}

export interface GetUserBalanceService {
    execute(userId: string): Promise<UserBalanceRepositoryResponse>
}

export interface UpdateUserService {
    execute(
        userId: string,
        params: UpdateUserParams,
    ): Promise<UserPublicResponse>
}

export interface DeleteUserService {
    execute(userId: string): Promise<UserPublicResponse>
}

export interface LoginUserService {
    execute(
        email: string,
        password: string,
    ): Promise<
        UserRepositoryResponse & { tokens: TokenGeneratorAdapterResponse }
    >
}

// Transaction
export interface CreateTransactionService {
    execute(params: CreateTransactionParams): Promise<TransactionPublicResponse>
}

export interface GetTransactionsByUserIdService {
    execute(userId: string): Promise<TransactionPublicResponse[]>
}

export interface UpdateTransactionService {
    execute(
        transactionId: string,
        params: UpdateTransactionParams,
    ): Promise<TransactionRepositoryResponse>
}

export interface DeleteTransactionService {
    execute(
        params: DeleteTransactionServiceParams,
    ): Promise<TransactionRepositoryResponse>
}

// ============================================================================
// HTTP REQUEST TYPES
// ============================================================================

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

// ============================================================================
// GENERIC SERVICE TYPES
// ============================================================================

export interface Service<TInput = unknown, TOutput = unknown> {
    execute(input: TInput): Promise<TOutput>
}

export interface ServiceWithMultipleParams<
    TInput1 = unknown,
    TInput2 = unknown,
    TOutput = unknown,
> {
    execute(input1: TInput1, input2: TInput2): Promise<TOutput>
}

export interface SimpleService<TInput = unknown, TOutput = unknown> {
    execute(input: TInput): Promise<TOutput>
}

export interface NoInputService<TOutput = unknown> {
    execute(): Promise<TOutput>
}

// ============================================================================
// GENERIC CONTROLLER TYPES
// ============================================================================

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

// ============================================================================
// ADAPTER INTERFACE TYPES
// ============================================================================

export interface TokenGeneratorAdapter {
    execute(userId: string): Promise<TokenGeneratorAdapterResponse>
}

export interface TokenGeneratorAdapterResponse {
    accessToken: string
    refreshToken: string
}

// ---

export interface PasswordComparatorAdapter {
    execute(password: string, hashedPassword: string): Promise<boolean>
}
