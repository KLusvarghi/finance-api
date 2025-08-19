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
    user_id: string
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

// ============================================================================
// CONTROLLER REQUEST TYPES
// ============================================================================

// User Controller Request Types
export interface CreateUserRequest {
    body: CreateUserParams
}

export interface UpdateUserRequest {
    body: UpdateUserParams
    params: { userId: string }
}

export interface GetUserByIdRequest {
    params: { userId: string }
}

export interface GetUserBalanceRequest {
    params: { userId: string }
}

export interface DeleteUserRequest {
    params: { userId: string }
}

// Transaction Controller Request Types
export interface CreateTransactionRequest {
    body: CreateTransactionParams
}

export interface UpdateTransactionRequest {
    body: UpdateTransactionParams
    params: { transactionId: string }
    headers: { userId: string }
}

export interface GetTransactionsByUserIdRequest {
    query: { userId: string }
}

export interface DeleteTransactionRequest {
    params: { transactionId: string }
    // headers: { userId: string }
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
    user_id: string
    name: string
    amount: number
    date: string
    type: 'EARNING' | 'EXPENSE' | 'INVESTMENT'
}

export interface UpdateTransactionParams {
    name?: string
    amount?: number
    date?: string
    type?: 'EARNING' | 'EXPENSE' | 'INVESTMENT'
}

// ============================================================================
// SERVICE INTERFACE TYPES
// ============================================================================

// User Repository Interfaces
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

// Transaction Repository Interfaces
export interface CreateTransactionRepository {
    execute(
        params: CreateTransactionParams & { id: string },
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
// CONTROLLER INTERFACE TYPES
// ============================================================================

// User Service Interfaces
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

// Transaction Service Interfaces
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
    execute(transactionId: string): Promise<TransactionRepositoryResponse>
}

// ============================================================================
// HTTP REQUEST TYPES
// ============================================================================

export interface HttpRequest {
    body?: any
    params?: any
    query?: any
    headers?: any
}

// ============================================================================
// GENERIC CONTROLLER TYPES
// ============================================================================

/**
 * Interface genérica para controllers que unifica a assinatura do método execute
 * @template TRequest - Tipo dos dados de entrada (body, params, query, etc.)
 * @template TResponse - Tipo dos dados de resposta
 */
export interface Controller<TRequest = unknown, TResponse = unknown> {
    execute(httpRequest: HttpRequest): Promise<HttpResponse<TResponse>>
}

// ============================================================================
// GENERIC SERVICE TYPES
// ============================================================================

/**
 * Interface genérica para services que unifica a assinatura do método execute
 * @template TInput - Tipo dos dados de entrada (parâmetros)
 * @template TOutput - Tipo dos dados de saída (resposta)
 */
export interface Service<TInput = unknown, TOutput = unknown> {
    execute(input: TInput): Promise<TOutput>
}

/**
 * Interface genérica para services que recebem múltiplos parâmetros
 * @template TInput1 - Primeiro tipo de parâmetro
 * @template TInput2 - Segundo tipo de parâmetro
 * @template TOutput - Tipo dos dados de saída
 */
export interface ServiceWithMultipleParams<
    TInput1 = unknown,
    TInput2 = unknown,
    TOutput = unknown,
    TOutput2 = unknown,
> {
    execute(input1: TInput1, input2: TInput2): Promise<TOutput2>
}

/**
 * Interface genérica para services que recebem um parâmetro simples (string, number, etc.)
 * @template TInput - Tipo do parâmetro de entrada
 * @template TOutput - Tipo dos dados de saída
 */
export interface SimpleService<TInput = unknown, TOutput = unknown> {
    execute(input: TInput): Promise<TOutput>
}

/**
 * Interface genérica para services que não recebem parâmetros
 * @template TOutput - Tipo dos dados de saída
 */
export interface NoInputService<TOutput = unknown> {
    execute(): Promise<TOutput>
}

/**
 * Interface genérica para controllers que precisam validar dados de entrada
 * @template TRequest - Tipo dos dados de entrada validados
 * @template TResponse - Tipo dos dados de resposta
 */
export interface ValidatedController<TRequest = unknown, TResponse = unknown> {
    execute(
        httpRequest: HttpRequest & { body: TRequest },
    ): Promise<HttpResponse<TResponse>>
}

/**
 * Interface genérica para controllers que trabalham com parâmetros de URL
 * @template TParams - Tipo dos parâmetros de URL
 * @template TResponse - Tipo dos dados de resposta
 */
export interface ParamsController<TParams = unknown, TResponse = unknown> {
    execute(
        httpRequest: HttpRequest & { params: TParams },
    ): Promise<HttpResponse<TResponse>>
}

/**
 * Interface genérica para controllers que trabalham com body e params
 * @template TBody - Tipo dos dados do body
 * @template TParams - Tipo dos parâmetros de URL
 * @template TResponse - Tipo dos dados de resposta
 */
export interface BodyParamsController<
    TBody = unknown,
    TParams = unknown,
    TResponse = unknown,
> {
    execute(
        httpRequest: HttpRequest & { body: TBody; params: TParams },
    ): Promise<HttpResponse<TResponse>>
}
