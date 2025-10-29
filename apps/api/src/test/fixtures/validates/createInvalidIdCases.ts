import { InvalidIdMessages } from '@/shared'

export const createInvalidIdCases = (messages: InvalidIdMessages) => [
    // {
    //     description: 'not provided',
    //     id: undefined,
    //     expectedMessage: messages.invalid,
    // },
    {
        description: 'too long',
        id: '12345678-1234-1234-1234-123456789012',
        expectedMessage: messages.invalid,
    },
    {
        description: 'too short',
        id: '12345678-1234-1234-1234-12345678901',
        expectedMessage: messages.invalid,
    },
    {
        description: 'with invalid characters',
        id: '12345678-1234-1234-1234-12345678901g',
        expectedMessage: messages.invalid,
    },
    {
        description: 'without hyphens',
        id: '12345678-1234-1234-1234-12345678901',
        expectedMessage: messages.invalid,
    },
    {
        description: 'completely invalid format',
        id: 'not-a-uuid-at-all',
        expectedMessage: messages.invalid,
    },
    // {
    //     description: 'empty string',
    //     id: '',
    //     expectedMessage: ResponseMessage.,
    // },
]
