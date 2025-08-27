import { notFound } from './http'
import { ErrorCode } from '@/errors'
export const transactionNotFoundResponse = (
    message,
    code = ErrorCode.TRANSACTION_NOT_FOUND,
) => notFound(message, code)
//# sourceMappingURL=transaction.js.map
