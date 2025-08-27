import isUUID from 'validator/lib/isUUID'
import { badRequest } from './http'
import { ErrorCode } from '@/errors'
import { ResponseMessage } from '@/shared'
export const checkIfIdIsValid = (id) => isUUID(id)
export const invalidIdResponse = () =>
    badRequest(ResponseMessage.INVALID_ID, ErrorCode.INVALID_ID)
export const requiredFieldMissingResponse = (message) =>
    badRequest(message, ErrorCode.MISSING_FIELD)
export const handleZodValidationError = (error) => {
    const message = error.issues?.[0]?.message ?? ResponseMessage.BAD_REQUEST
    return badRequest(message, ErrorCode.BAD_REQUEST)
}
//# sourceMappingURL=validator.js.map
