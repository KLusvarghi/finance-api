import isUUID from 'validator/lib/isUUID'
import { badRequest } from './http'
import { ZodError } from 'zod'

export const checkIfIdIsValid = (id: string) => isUUID(id)

export const invalidIdResponse = () =>
    badRequest('The provider id is not valid.')

export const requiredFieldMissingResponse = (
    missingField: string | undefined,
) => badRequest(`The field ${missingField} is required.`)

export const handleZodValidationError = (error: ZodError) => {
    const firstMessage = error.issues?.[0]?.message ?? 'Bad Request'
    return badRequest(firstMessage)
}
