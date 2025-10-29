import { ResponseMessage } from '@/shared'

import { AppError, ErrorCode } from './index'

export class EmailAlreadyExistsError extends AppError {
    constructor(email: string) {
        super(
            `The e-mail ${email} is already in use`,
            ErrorCode.EMAIL_ALREADY_EXISTS,
        )
    }
}

export class LoginFailedError extends AppError {
    constructor() {
        super(
            ResponseMessage.USER_INVALID_PASSWORD_OR_EMAIL,
            ErrorCode.LOGIN_FAILED,
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
        super(ResponseMessage.FORBIDDEN, ErrorCode.FORBIDDEN)
    }
}

export class UserIdMissingError extends AppError {
    constructor() {
        super(ResponseMessage.USER_ID_MISSING, ErrorCode.USER_ID_MISSING)
    }
}

export class UnauthorizedError extends AppError {
    constructor() {
        super(ResponseMessage.UNAUTHORIZED, ErrorCode.UNAUTHORIZED)
    }
}
