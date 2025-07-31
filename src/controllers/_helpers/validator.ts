import isUUID from 'validator/lib/isUUID'
import { badRequest } from './http'
import isEmpty from 'validator/lib/isEmpty'

export const checkIfIdIsValid = (id: string) => isUUID(id)

export const invalidIdResponse = () =>
    badRequest('The provider id is not valid.')

export const checkIfIsString = (
    value: 'string' | 'number' | 'boolean' | null | undefined,
) => typeof value === 'string'

export const validateRequiredFields = (
    params: any,
    requiredFields: string[],
) => {
    for (const field of requiredFields) {
        const fieldIsMissing = !params[field]
        const fieldIsEmpty =
            checkIfIsString(params[field]) &&
            isEmpty(params[field], {
                ignore_whitespace: true,
            })
        if (fieldIsMissing || fieldIsEmpty) {
            // o ideal de quand ose cria um função mais genérica, não é que ela retorne um erro, e sim um boolean
            return { ok: false, missingField: field }
        }
    }
    return { ok: true, missingField: undefined }
}
