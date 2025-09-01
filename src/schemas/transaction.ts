import isCurrency from 'validator/lib/isCurrency'
import z from 'zod'

export const createTransactionSchema = z.object({
    // userId: z
    //     .string({
    //         message: 'User id is required',
    //     })
    //     .min(1, { message: 'User id is required' }) // o min é para validar se o campo é obrigatório
    //     .uuid({
    //         message: 'User id must be a valid uuid',
    //     }),
    name: z
        .string({
            message: 'Name is required',
        })
        .min(3, {
            message: 'Name must be at least 3 characters long',
        })
        .max(100, {
            message: 'Name must be at most 100 characters long',
        }),
    // esse tipo de date é um tipo que aceita vários formatos, e nos serve bem
    date: z
        .string({
            message: 'Date is required',
        })
        .datetime({
            message: 'Date must be a valid date',
        }),
    type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT'], {
        message: 'Type must be EARNING, EXPENSE or INVESTMENT',
    }),
    amount: z
        .number({
            message: 'Amount is required',
        })
        .min(1, {
            message: 'Amount must be greater than 0',
        })
        // quando temos que fazer validações que o zod não nos fornece, podemos usar o refine e se o que a gente colocar retornar false/null/undefined ele gera erro, caso contrário ele valida
        .refine(
            (value) => {
                // Check if the value has more than 2 decimal places
                const decimalPlaces = (value.toString().split('.')[1] || '')
                    .length
                if (decimalPlaces > 2) {
                    return false
                }
                // Also check if it's a valid currency format
                return isCurrency(value.toString(), {
                    digits_after_decimal: [0, 1, 2],
                    allow_negatives: false,
                    decimal_separator: '.',
                })
            },
            { message: 'Amount must be a valid currency (2 decimal places)' },
        ),
})

export const updateTransactionSchema = createTransactionSchema
    // o omit ele exclui o campo "userId" do schema, entõa ele não aceira esse campo na hora de valdiar
    // .omit({
    //     userId: true,
    // })
    // .optional() // o "optional" assim a gente atribui o que tem no schema e deixamos ele opcional
    // Resultado: { name: string, email: string } | undefined
    .partial() // o "partial" assim a gente atribui o que tem no schema e deixamos ele opcional
    .strict() // "strict" fará com que ele seja estrito, e não deixará passar campos que não existem no schema
