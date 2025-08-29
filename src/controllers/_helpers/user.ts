import { badRequest, notFound, unauthorized } from './http'

import { ErrorCode } from '@/errors'
import { ResponseMessage } from '@/shared'

export const userNotFoundResponse = (
    message: string,
    code: ErrorCode = ErrorCode.USER_NOT_FOUND,
) => notFound(message, code)

export const userIdMissingResponse = () =>
    badRequest(ResponseMessage.USER_ID_MISSING, ErrorCode.USER_ID_MISSING)

export const emailAlreadyExistsResponse = (
    message: string,
    code: ErrorCode = ErrorCode.EMAIL_ALREADY_EXISTS,
) => badRequest(message, code)

export const invalidPasswordResponse = () =>
    unauthorized(ErrorCode.INVALID_PASSWORD)
