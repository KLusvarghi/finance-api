import isUUID from 'validator/lib/isUUID'
import { ZodError } from 'zod'

import { badRequest, notFound } from './http'

import { AppError, ErrorCode } from '@/errors'
import { ResponseMessage } from '@/shared'

export const checkIfIdIsValid = (id: string): boolean => isUUID(id)

export const invalidIdResponse = (entity: 'userId' | 'transactionId') => {
    switch (entity) {
        case 'userId':
            return badRequest(
                ResponseMessage.USER_INVALID_ID,
                ErrorCode.USER_ID_INVALID,
            )
        case 'transactionId':
            return badRequest(
                ResponseMessage.TRANSACTION_INVALID_ID,
                ErrorCode.TRANSACTION_ID_INVALID,
            )
        default:
            return badRequest(ResponseMessage.INVALID_ID, ErrorCode.INVALID_ID)
    }
}

export const requiredFieldMissingResponse = (
    field: 'userId' | 'transactionId',
) => {
    switch (field) {
        case 'userId':
            return badRequest(
                ResponseMessage.USER_ID_MISSING,
                ErrorCode.USER_ID_MISSING,
            )
        case 'transactionId':
            return badRequest(
                ResponseMessage.TRANSACTION_ID_MISSING,
                ErrorCode.TRANSACTION_ID_MISSING,
            )
        default:
            return badRequest(
                ResponseMessage.MISSING_FIELD,
                ErrorCode.MISSING_FIELD,
            )
    }
}

export const notFoundResponse = (error: AppError) =>
    notFound(error.message, error.code)

export const handleZodValidationError = (error: ZodError) => {
    const message = error.issues?.[0]?.message ?? ResponseMessage.BAD_REQUEST
    return badRequest(message, ErrorCode.BAD_REQUEST)
}
