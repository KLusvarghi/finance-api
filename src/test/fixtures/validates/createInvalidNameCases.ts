import { InvalidNameMessages } from '@/shared'

export const createInvalidNameCases = (messages: InvalidNameMessages) => [
    {
        description: 'not provided',
        name: undefined,
        expectedMessage: messages.required,
    },
    {
        description: 'empty string',
        name: '',
        expectedMessage: messages.minLength,
    },
    {
        description: 'too short',
        name: 'A',
        expectedMessage: messages.minLength,
    },
    {
        description: 'null value',
        name: null,
        expectedMessage: messages.required,
    },
    {
        description: 'number value',
        name: 12345,
        expectedMessage: messages.required,
    },
    {
        description: 'boolean value',
        name: true,
        expectedMessage: messages.required,
    },
    {
        description: 'array value',
        name: ['Doe'],
        expectedMessage: messages.required,
    },
    {
        description: 'object value',
        name: { name: 'Doe' },
        expectedMessage: messages.required,
    },
]
