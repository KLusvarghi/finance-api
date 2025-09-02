import { badRequest } from './http'

import { ErrorCode } from '@/errors'

export const emailAlreadyExistsResponse = (
    message: string,
    code: ErrorCode = ErrorCode.EMAIL_ALREADY_EXISTS,
) => badRequest(message, code)
