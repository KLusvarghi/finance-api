import { badRequest, unauthorized } from './http'

import { ErrorCode } from '@/errors'

export const emailAlreadyExistsResponse = (
    message: string,
    code: ErrorCode = ErrorCode.EMAIL_ALREADY_EXISTS,
) => badRequest(message, code)

export const invalidPasswordResponse = () =>
    unauthorized(ErrorCode.INVALID_PASSWORD)
