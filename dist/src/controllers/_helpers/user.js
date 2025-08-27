import { badRequest, notFound } from './http'
import { ErrorCode } from '@/errors'
import { ResponseMessage } from '@/shared'
export const userNotFoundResponse = (
    message,
    code = ErrorCode.USER_NOT_FOUND,
) => notFound(message, code)
export const userIdMissingResponse = () =>
    badRequest(ResponseMessage.USER_ID_MISSING, ErrorCode.USER_ID_MISSING)
export const emailAlreadyExistsResponse = (
    message,
    code = ErrorCode.EMAIL_ALREADY_EXISTS,
) => badRequest(message, code)
//# sourceMappingURL=user.js.map
