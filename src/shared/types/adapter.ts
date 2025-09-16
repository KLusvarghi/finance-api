export interface TokensGeneratorAdapter {
    execute(userId: string): Promise<TokensGeneratorAdapterResponse>
}

export interface TokensGeneratorAdapterResponse {
    accessToken: string
    refreshToken: string
}

// ---

export interface PasswordComparatorAdapter {
    execute(password: string, hashedPassword: string): Promise<boolean>
}

export type InvalidIdMessages = {
    missing: string
    invalid: string
}
export type InvalidNameMessages = {
    required: string
    minLength: string
}
