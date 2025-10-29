import isCurrency from 'validator/lib/isCurrency.js'
import z from 'zod'

import { transactionIdSchema } from './common'

// Body schemas (for request body validation)
export const createTransactionBodySchema = z
    .object({
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
            // Database Decimal(10, 2) allows max 99999999.99 (8 digits + 2 decimals)
            .max(99999999.99, {
                message: 'Amount must be a valid currency (2 decimal places)',
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
                {
                    message:
                        'Amount must be a valid currency (2 decimal places)',
                },
            ),
    })
    .strict() // "strict" fará com que ele seja estrito, e não deixará passar campos que não existem no schema

// Route schemas (for middleware validation)
export const createTransactionSchema = z.object({
    body: createTransactionBodySchema,
})

// o omit ele exclui o campo "userId" do schema, entõa ele não aceira esse campo na hora de valdiar
// .omit({
//     userId: true,
// })
// .optional() // o "optional" assim a gente atribui o que tem no schema e deixamos ele opcional
// Resultado: { name: string, email: string } | undefined

export const updateTransactionBodySchema = createTransactionBodySchema.partial() // o "partial" assim a gente atribui o que tem no schema e deixamos ele opcional
// .strict() // "strict" fará com que ele seja estrito, e não deixará passar campos que não existem no schema

export const updateTransactionParamsSchema = z.object({
    transactionId: transactionIdSchema,
})

export const updateTransactionSchema = z.object({
    params: updateTransactionParamsSchema,
    body: updateTransactionBodySchema,
})

export const getTransactionsByUserIdQuerySchema = z.object({
    // Filters
    title: z.string().optional(),
    type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT']).optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    // Pagination
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
    cursor: z.string().optional(),
})

export const getTransactionsByUserIdSchema = z.object({
    body: z.object({}).optional(),
    params: z.object({}).optional(),
    query: getTransactionsByUserIdQuerySchema,
})

export const deleteTransactionParamsSchema = z.object({
    transactionId: transactionIdSchema,
})

export const deleteTransactionSchema = z.object({
    params: deleteTransactionParamsSchema,
})
