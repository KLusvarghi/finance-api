import { ResponseZodMessages } from '@/shared'

export const invalidTokenCases = [
    {
        description: 'token is undefined',
        token: undefined,
        message: ResponseZodMessages.refreshToken.required,
    },
    {
        description: 'token is null',
        token: null,
        message: ResponseZodMessages.refreshToken.required,
    },
    {
        description: 'authorization header is empty',
        token: '',
        message: ResponseZodMessages.refreshToken.required,
    },
    {
        description: 'authorization header does not contain Bearer prefix',
        token: 'invalid-token-without-bearer',
        message: ResponseZodMessages.refreshToken.required,
    },
    {
        description: 'authorization header only contains Bearer',
        token: 'Bearer',
        message: ResponseZodMessages.refreshToken.required,
    },
    {
        description:
            'authorization header contains Bearer with space but no token',
        token: 'Bearer ',
        message: ResponseZodMessages.refreshToken.required,
    },
    {
        description: 'token is malformed',
        token: 'Bearer malformed.token.here',
        message: ResponseZodMessages.refreshToken.required,
    },
    {
        description: 'token has invalid signature',
        token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItaWQiLCJpYXQiOjE2MzQ1NjQ3ODksImV4cCI6MTYzNDU2ODM4OX0.invalid-signature',
        message: ResponseZodMessages.refreshToken.required,
    },
    {
        description: 'token is expired',
        // This will be handled by jwt.verify throwing an error
        token: 'Bearer expired-token',
        message: ResponseZodMessages.refreshToken.required,
    },
    {
        description: 'is only whitespace',
        token: '   ',
        message: ResponseZodMessages.refreshToken.minLength,
    },
    {
        description: 'is empty string',
        token: '',
        message: ResponseZodMessages.refreshToken.minLength,
    },
]
