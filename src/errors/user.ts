import { AppError, ErrorCode } from './index'

export class EmailAlreadyExistsError extends AppError {
    constructor(email: string) {
        super(
            `The e-mail ${email} is already in use`,
            ErrorCode.EMAIL_ALREADY_EXISTS,
        )
    }
}

export class UserNotFoundError extends AppError {
    constructor(userId: string) {
        super(`User with id ${userId} not found`, ErrorCode.USER_NOT_FOUND)
    }
}

export class UpdateUserFailedError extends AppError {
    constructor(msg = 'Failed to update user.') {
        super(msg, ErrorCode.USER_UPDATE_FAILED)
    }
}

export class ForbiddenError extends AppError {
    constructor() {
        super('Forbidden', ErrorCode.FORBIDDEN)
    }
}

export class InvalidPasswordError extends AppError {
    constructor() {
        super('Invalid password', ErrorCode.INVALID_PASSWORD)
    }
}

export class UserIdMissingError extends AppError {
    constructor() {
        super('User ID is missing', ErrorCode.USER_ID_MISSING)
    }
}
