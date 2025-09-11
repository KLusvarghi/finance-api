import { z } from 'zod'

export const loginBodySchema = z.object({
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

export const loginSchema = z.object({
    body: loginBodySchema,
})

export const refreshTokenBodySchema = z.object({
    refreshToken: z
        .string({
            message: 'Refresh token is required',
        })
        .trim()
        .min(1, {
            message: 'Refresh token must have at least 1 character',
        }),
})

export const refreshTokenSchema = z.object({
    body: refreshTokenBodySchema,
})
