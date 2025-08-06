import isUUID from 'validator/lib/isUUID'
import isEmpty from 'validator/lib/isEmpty'
import { badRequest } from './http'
import { ZodError } from 'zod'

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

export const requiredFieldMissingResponse = (
    missingField: string | undefined,
) => badRequest(`The field ${missingField} is required.`)

export const handleZodValidationError = (error: ZodError) => {
    const errorMessages = error.issues.map((err) => {
        // Verifica se é um erro de campos não reconhecidos
        if (err.code === 'unrecognized_keys' && 'keys' in err) {
            return `Campo(s) não permitido(s): ${err.keys.join(', ')}.`
        }

        // Verifica se é um erro de tipo inválido
        if (err.code === 'invalid_type' && 'path' in err && 'expected' in err) {
            return `Campo "${err.path.join('.')}" deve ser do tipo ${err.expected}`
        }

        // Verifica se é um erro de string inválida
        if (
            err.code === 'invalid_format' &&
            'path' in err &&
            'validation' in err
        ) {
            if (err.validation === 'uuid') {
                return `Campo "${err.path.join('.')}" deve ser um UUID válido`
            }
            if (err.validation === 'datetime') {
                return `Campo "${err.path.join('.')}" deve ser uma data válida`
            }
            return err.message || 'Campo inválido'
        }

        // Verifica se é um erro de valor muito pequeno
        if (err.code === 'too_small' && 'path' in err && 'minimum' in err) {
            return `Campo "${err.path.join('.')}" deve ser maior que ${err.minimum}`
        }

        // Fallback para outros tipos de erro
        return err.message || 'Erro de validação'
    })

    return badRequest('Dados inválidos para atualização', {
        errors: errorMessages,
    })
}
