import z from 'zod'

export const createUserSchema = z.object({
    first_name: z
        .string({
            message: 'First name is required',
        })
        .trim()
        .min(2, {
            message: 'First name must have at least 2 characters',
        }),
    last_name: z
        .string({
            message: 'Last name is required',
        })
        .trim()
        .min(2, {
            message: 'Last name must have at least 2 characters',
        }),
    email: z
        .string({
            message: 'Email is required',
        })
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
export const updateUserSchema = createUserSchema.partial().strict()

export const loginSchema = z.object({
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
