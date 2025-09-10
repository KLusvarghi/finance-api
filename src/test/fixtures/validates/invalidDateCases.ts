import { ResponseZodMessages } from '@/shared'

export const invalidDateCases = [
    // {
    //     description: 'not provided',
    //     date: undefined,
    //     expectedMessage: ResponseZodMessages.date.required,
    // },
    {
        description: 'null value',
        date: null,
        expectedMessage: ResponseZodMessages.date.required,
    },
    {
        description: 'empty string',
        date: '',
        expectedMessage: ResponseZodMessages.date.invalid,
    },
    {
        description: 'common string format',
        date: '25/08/2024',
        expectedMessage: ResponseZodMessages.date.invalid,
    },
    {
        description: 'invalid american format',
        date: '08/25/2024',
        expectedMessage: ResponseZodMessages.date.invalid,
    },
    {
        description: 'invalid timestamp format',
        date: '1234567890',
        expectedMessage: ResponseZodMessages.date.invalid,
    },
    {
        description: 'with text',
        date: 'not a date',
        expectedMessage: ResponseZodMessages.date.invalid,
    },
    {
        description: 'incomplete date',
        date: '2024-08',
        expectedMessage: ResponseZodMessages.date.invalid,
    },
    {
        description: 'impossible values',
        date: '2024-13-32',
        expectedMessage: ResponseZodMessages.date.invalid,
    },
    {
        description: 'with special characters',
        date: '2024/08-25@10:30',
        expectedMessage: ResponseZodMessages.date.invalid,
    },
    {
        description: 'incorrect time format',
        date: '2024-08-25 25:61:61',
        expectedMessage: ResponseZodMessages.date.invalid,
    },
    {
        description: 'only numbers',
        date: '20240825',
        expectedMessage: ResponseZodMessages.date.invalid,
    },
]
