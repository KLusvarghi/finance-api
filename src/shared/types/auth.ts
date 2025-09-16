import { AuthenticatedUserResponse } from './user'

export interface RefreshTokenResponse {
    accessToken: string
    refreshToken: string
}

export interface AuthenticateUserService {
    execute(email: string, password: string): Promise<AuthenticatedUserResponse>
}
