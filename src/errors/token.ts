import { AppError } from './app-error'
import { ErrorCode } from './enum'

export class TokenGenerationError extends AppError {
    constructor() {
        super(
            'Failed to generate authentication tokens.',
            ErrorCode.TOKEN_GENERATION_FAILED,
        )
    }
}

export class InvalidTokenError extends AppError {
    constructor() {
        super('The provided token is invalid.', ErrorCode.TOKEN_INVALID)
    }
}

export class ExpiredTokenError extends AppError {
    constructor() {
        super('The provided token has expired.', ErrorCode.TOKEN_EXPIRED)
    }
}
