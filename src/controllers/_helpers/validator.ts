import isUUID from 'validator/lib/isUUID'
import { ZodError } from 'zod'

import { badRequest } from './http'

import { ErrorCode } from '@/errors'
import { ResponseMessage } from '@/shared'

export const checkIfIdIsValid = (id: string): boolean => isUUID(id)

export const invalidIdResponse = () =>
    badRequest(ResponseMessage.INVALID_ID, ErrorCode.INVALID_ID)

export const requiredFieldMissingResponse = (message: string) =>
    badRequest(message, ErrorCode.MISSING_FIELD)

export const handleZodValidationError = (error: ZodError) => {
    const message = error.issues?.[0]?.message ?? ResponseMessage.BAD_REQUEST
    return badRequest(message, ErrorCode.BAD_REQUEST)
}
