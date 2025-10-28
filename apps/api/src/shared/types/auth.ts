import type { AuthenticatedUserResponse } from './user.ts'

export interface RefreshTokenResponse {
    accessToken: string
    refreshToken: string
}

export interface AuthenticateUserService {
    execute(email: string, password: string): Promise<AuthenticatedUserResponse>
}

export interface RefreshTokenService {
    execute(refreshToken: string): Promise<RefreshTokenResponse>
}
