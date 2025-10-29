import { ResponseZodMessages } from '@/shared'

export const invalidPasswordCases = [
    {
        description: 'missing password',
        password: undefined,
        expectedMessage: ResponseZodMessages.password.required,
    },
    {
        description: 'empty password',
        password: '',
        expectedMessage: ResponseZodMessages.password.minLength,
    },
    {
        description: 'password too short',
        password: '123',
        expectedMessage: ResponseZodMessages.password.minLength,
    },
    {
        description: 'number value',
        password: 123456,
        expectedMessage: ResponseZodMessages.password.required,
    },
    {
        description: 'boolean value',
        password: false,
        expectedMessage: ResponseZodMessages.password.required,
    },
    {
        description: 'array value',
        password: ['password123'],
        expectedMessage: ResponseZodMessages.password.required,
    },
    {
        description: 'object value',
        password: { password: 'password123' },
        expectedMessage: ResponseZodMessages.password.required,
    },
]
