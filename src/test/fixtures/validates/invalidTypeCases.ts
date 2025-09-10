import { ResponseZodMessages } from '@/shared'

export const invalidTypeCases = [
    {
        description: 'lowercase type',
        type: 'earning',
        expectedMessage: ResponseZodMessages.type.invalid,
    },
    {
        description: 'with special characters',
        type: 'EARNING@',
        expectedMessage: ResponseZodMessages.type.invalid,
    },
    {
        description: 'non-existent type',
        type: 'SAVINGS',
        expectedMessage: ResponseZodMessages.type.invalid,
    },
    {
        description: 'empty string',
        type: '',
        expectedMessage: ResponseZodMessages.type.invalid,
    },
    {
        description: 'with trailing spaces',
        type: 'EARNING ',
        expectedMessage: ResponseZodMessages.type.invalid,
    },
    {
        description: 'with spaces in between',
        type: 'EARN ING',
        expectedMessage: ResponseZodMessages.type.invalid,
    },
    {
        description: 'with numbers',
        type: 'EARNING123',
        expectedMessage: ResponseZodMessages.type.invalid,
    },
    {
        description: 'partially correct',
        type: 'EXPENS',
        expectedMessage: ResponseZodMessages.type.invalid,
    },
    {
        description: 'with mixed case',
        type: 'EaRnInG',
        expectedMessage: ResponseZodMessages.type.invalid,
    },
    {
        description: 'numeric value',
        type: 1,
        expectedMessage: ResponseZodMessages.type.invalid,
    },
]
