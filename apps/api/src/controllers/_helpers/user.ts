import { ErrorCode } from '@/errors'

import { badRequest } from './http'

export const emailAlreadyExistsResponse = (
    message: string,
    code: ErrorCode = ErrorCode.EMAIL_ALREADY_EXISTS,
) => badRequest(message, code)
