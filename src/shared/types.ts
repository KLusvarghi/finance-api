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
    earning: Prisma.Decimal | number
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
    type: 'EARNING' | 'EXPENSE' | 'INVESTMENT'
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
// TRANSACTION PARAMETER TYPES
// ============================================================================

export type CreateTransactionParams = Omit<Prisma.TransactionCreateInput, 'id'>

export interface UpdateTransactionParams {
    name?: string
    amount?: Prisma.Decimal
    date?: Date
    type?: 'EARNING' | 'EXPENSE' | 'INVESTMENT'
}
