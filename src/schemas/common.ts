import z from 'zod'

// Função para validar UUID v4 (mais flexível para futuras mudanças)
const validateUUID = (value: string): boolean => {
    // Regex para UUID v4
    const uuidV4Regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidV4Regex.test(value)
}

// Schema reutilizável para UUID v4 (recomendado)
export const uuidV4Schema = z
    .string({
        message: 'ID is required',
    })
    .refine(validateUUID, {
        message: 'ID must be a valid UUID v4',
    })

// Schema específico para user ID
export const userIdSchema = z
    .string({
        message: 'User ID is required',
    })
    .min(1, {
        message: 'User ID is required',
    })
    .refine(validateUUID, {
        message: 'User ID must be a valid UUID',
    })

// Schema específico para transaction ID
export const transactionIdSchema = z
    .string({
        message: 'Transaction ID is required',
    })
    .min(1, {
        message: 'Transaction ID is required',
    })
    .refine(validateUUID, {
        message: 'Transaction ID is not valid',
    })

// // Função helper para criar schemas de ID customizados
// export const createIdSchema = (fieldName: string, uuidVersion: 'v4' | 'any' = 'v4') => {
//     const validator = uuidVersion === 'v4' ? validateUUID : validateAnyUUID
//     const versionText = uuidVersion === 'v4' ? 'v4' : ''

//     return z
//         .string({
//             message: `${fieldName} is required`,
//         })
//         .refine(validator, {
//             message: `${fieldName} must be a valid UUID ${versionText}`.trim(),
//         })
// }
