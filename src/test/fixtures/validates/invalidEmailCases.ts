import { ResponseZodMessages } from '@/shared'

export const invalidEmailCases = [
    {
        description: 'not provided',
        email: undefined,
        expectedMessage: ResponseZodMessages.email.required,
    },
    {
        description: 'null value',
        email: null,
        expectedMessage: ResponseZodMessages.email.required,
    },
    {
        description: 'empty string with spaces',
        email: '     ',
        expectedMessage: ResponseZodMessages.email.invalid,
    },
    {
        description: 'empty string',
        email: '',
        expectedMessage: ResponseZodMessages.email.invalid,
    },
    {
        description: 'undefined value',
        email: undefined,
        expectedMessage: ResponseZodMessages.email.required,
    },
    {
        description: 'null value',
        email: null,
        expectedMessage: ResponseZodMessages.email.required,
    },
    {
        description: 'missing @ symbol',
        email: 'userexample.com',
        expectedMessage: ResponseZodMessages.email.invalid,
    },
    {
        description: 'missing domain',
        email: 'user@',
        expectedMessage: ResponseZodMessages.email.invalid,
    },
    {
        description: 'missing username',
        email: '@example.com',
        expectedMessage: ResponseZodMessages.email.invalid,
    },
    {
        description: 'space in email',
        email: 'user @example.com',
        expectedMessage: ResponseZodMessages.email.invalid,
    },
    {
        description: 'multiple @ symbols',
        email: 'user@@example.com',
        expectedMessage: ResponseZodMessages.email.invalid,
    },
    {
        description: 'invalid domain',
        email: 'user@example',
        expectedMessage: ResponseZodMessages.email.invalid,
    },
    {
        description: 'number value',
        email: 12345,
        expectedMessage: ResponseZodMessages.email.required,
    },
    {
        description: 'boolean value',
        email: true,
        expectedMessage: ResponseZodMessages.email.required,
    },
    {
        description: 'array value',
        email: ['user@example.com'],
        expectedMessage: ResponseZodMessages.email.required,
    },
    {
        description: 'object value',
        email: { email: 'user@example.com' },
        expectedMessage: ResponseZodMessages.email.required,
    },
]
