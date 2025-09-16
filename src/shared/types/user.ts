import { TokensGeneratorAdapterResponse } from './adapter'

import { Prisma } from '@prisma/client'

// User Repository Responses
export type UserRepositoryResponse = Prisma.UserGetPayload<
    Record<string, never>
>

// Custom Repository Responses
export interface UserBalanceRepositoryResponse {
    earnings: string
    expenses: string
    investments: string
    balance: string
    earningsPercentage: number
    expensesPercentage: number
    investmentsPercentage: number
}

export interface UserPublicResponse {
    id: string
    firstName: string
    lastName: string
    email: string
}

export type UserWithTokensResponse = UserPublicResponse & {
    tokens: TokensGeneratorAdapterResponse
}

export type CreateUserRepositoryParams = CreateUserParams & {
    id: string
    password: string
}

export type AuthenticatedUserResponse = UserRepositoryResponse & {
    tokens: TokensGeneratorAdapterResponse
}

export interface CreateUserParams {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface UpdateUserParams {
    firstName?: string
    lastName?: string
    email?: string
    password?: string
}

export interface UserIdRequestParams {
    userId: string
}

export interface UserHttpRequest {
    firstName: string
    lastName: string
    email: string
    password: string
}

// REPOSITORY INTERFACE TYPES
export interface CreateUserRepository {
    execute(user: CreateUserRepositoryParams): Promise<UserRepositoryResponse>
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
    execute(
        userId: string,
        from: string,
        to: string,
    ): Promise<UserBalanceRepositoryResponse>
}

// SERVICE PARAMETER TYPES
export interface UpdateUserServiceParams {
    userId: string
    updateUserParams: UpdateUserParams
}

// SERVICE INTERFACE TYPES
export interface CreateUserService {
    execute(params: CreateUserParams): Promise<UserWithTokensResponse>
}

export interface GetUserByIdService {
    execute(userId: string): Promise<UserPublicResponse>
}

export interface GetUserBalanceService {
    execute(
        userId: string,
        from: string,
        to: string,
    ): Promise<UserBalanceRepositoryResponse>
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
