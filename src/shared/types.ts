import { Prisma } from '@prisma/client'

// ============================================================================
// HTTP RESPONSE TYPES
// ============================================================================

export type HttpResponse<T = any> = {
    statusCode: number
    body: {
        status: 'success' | 'error'
        message: string
        data?: T
    } | null
}

// ============================================================================
// REPOSITORY RESPONSE TYPES
// ============================================================================

// User Repository Responses
export type UserRepositoryResponse = Prisma.UserGetPayload<{}>

// Transaction Repository Responses
export type TransactionRepositoryResponse = Prisma.TransactionGetPayload<{}>

// Custom Repository Responses
export interface UserBalanceRepositoryResponse {
    earnings: Prisma.Decimal | number
    expenses: Prisma.Decimal | number
    investments: Prisma.Decimal | number
    balance: Prisma.Decimal
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
    type: Prisma.TransactionGetPayload<{}>['type']
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
    ): Promise<UserRepositoryResponse | null>
}

export interface DeleteUserService {
    execute(userId: string): Promise<UserPublicResponse>
}

// Transaction Service Interfaces
export interface CreateTransactionService {
    execute(params: CreateTransactionParams): Promise<TransactionPublicResponse>
}

export interface GetTransactionsByUserIdService {
    execute(userId: string): Promise<TransactionRepositoryResponse[] | null>
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
