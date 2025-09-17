import { Prisma } from '@prisma/client'

// Transaction Repository Responses
export type TransactionRepositoryResponse = Prisma.TransactionGetPayload<
    Record<string, never>
>

export interface TransactionPublicResponse {
    id: string
    userId: string
    name: string
    amount: Prisma.Decimal
    date: Date
    type: Prisma.TransactionGetPayload<Record<string, never>>['type']
    updatedAt: Date
}

export interface PaginatedTransactionsResponse {
    transactions: TransactionPublicResponse[]
    nextCursor: string | null
}

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

export interface DeleteTransactionServiceParams {
    transactionId: string
    userId: string
}

export type CreateTransactionRepositoryParams =
    CreateTransactionServiceParams & {
        id: string
    }

// REPOSITORY INTERFACE TYPES
export interface CreateTransactionRepository {
    execute(
        params: CreateTransactionRepositoryParams,
    ): Promise<TransactionRepositoryResponse>
}

export interface GetTransactionsByUserIdRepository {
    execute(
        userId: string,
        from: string,
        to: string,
        options?: {
            limit: number
            cursor?: string
        },
    ): Promise<{
        transactions: TransactionRepositoryResponse[]
        nextCursor: string | null
    }>
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

// SERVICE INTERFACE TYPES
export interface CreateTransactionService {
    execute(params: CreateTransactionParams): Promise<TransactionPublicResponse>
}

export interface GetTransactionsByUserIdService {
    execute(
        userId: string,
        from: string,
        to: string,
        options?: {
            limit: number
            cursor?: string
        },
    ): Promise<PaginatedTransactionsResponse>
}

export interface UpdateTransactionService {
    execute(
        transactionId: string,
        params: UpdateTransactionParams,
    ): Promise<TransactionPublicResponse>
}

export interface DeleteTransactionService {
    execute(
        params: DeleteTransactionServiceParams,
    ): Promise<TransactionPublicResponse>
}
