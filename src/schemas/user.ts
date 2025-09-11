import z from 'zod'

// Body schemas (for request body validation)
export const createUserBodySchema = z.object({
    firstName: z
        .string({
            message: 'First name is required',
        })
        .trim()
        .min(2, {
            message: 'First name must have at least 2 characters',
        }),
    lastName: z
        .string({
            message: 'Last name is required',
        })
        .trim()
        .min(2, {
            message: 'Last name must have at least 2 characters',
        }),
    email: z
        .email({
            message: 'Please provide a valid email',
        })
        .trim()
        .min(2),
    password: z
        .string({
            message: 'Password is required',
        })
        .trim()
        .min(6, {
            message: 'Password must have at least 6 characters',
        }),
})

// o partial assim a gente atribui o que tem no schema e deixamos ele opcional
// e o metodo "strict" fará com que ele seja estrito, e não deixará passar campos que não existem no schema

// Route schemas (for middleware validation)
export const createUserSchema = z.object({
    body: createUserBodySchema,
})

export const updateUserBodySchema = createUserBodySchema.partial().strict()

export const updateUserSchema = z.object({
    body: updateUserBodySchema,
})

export const getUserBalanceQuerySchema = z.object({
    from: z
        .string({
            message: 'From is required',
        })
        .refine(
            (dateString) => {
                try {
                    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
                    if (!dateRegex.test(dateString.toString())) {
                        return false
                    }
                    // Additional validation: check if the date is actually valid
                    const date = new Date(dateString + 'T00:00:00.000Z')
                    return date.toISOString().startsWith(dateString)
                } catch {
                    return false
                }
            },
            {
                message: 'From must be in YYYY-MM-DD format',
            },
        ),
    to: z
        .string({
            message: 'To is required',
        })
        .refine(
            (dateString) => {
                try {
                    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
                    if (!dateRegex.test(dateString.toString())) {
                        return false
                    }
                    // Additional validation: check if the date is actually valid
                    const date = new Date(dateString + 'T00:00:00.000Z')
                    return date.toISOString().startsWith(dateString)
                } catch {
                    return false
                }
            },
            {
                message: 'To must be in YYYY-MM-DD format',
            },
        ),
})

export const getUserBalanceSchema = z.object({
    query: getUserBalanceQuerySchema,
})

// Schema for routes that only need user ID from auth middleware (no validation needed)
export const getUserByIdSchema = z.object({})

export const deleteUserSchema = z.object({})
