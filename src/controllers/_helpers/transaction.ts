import { notFound } from './http'

import { ErrorCode } from '@/errors'

export const transactionNotFoundResponse = (
    message: string,
    code: ErrorCode = ErrorCode.TRANSACTION_NOT_FOUND,
) => notFound(message, code)
