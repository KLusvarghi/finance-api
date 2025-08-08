export const invalidUUID = [
    {
        description: 'too long',
        id: '12345678-1234-1234-1234-123456789012',
    },
    {
        description: 'too short',
        id: '12345678-1234-1234-1234-12345678901',
    },
    {
        description: 'with invalid characters',
        id: '12345678-1234-1234-1234-12345678901g',
    },
    {
        description: 'without hyphens',
        id: '12345678-1234-1234-1234-12345678901',
    },
    {
        description: 'completely invalid format',
        id: 'not-a-uuid-at-all',
    },
    // {
    //     description: 'empty string',
    //     id: '',
    // },
]

export const invalidDate = [
    {
        description: 'common string format',
        date: '25/08/2024',
    },
    {
        description: 'invalid american format',
        date: '08/25/2024',
    },
    {
        description: 'invalid timestamp format',
        date: '1234567890',
    },
    {
        description: 'with text',
        date: 'not a date',
    },
    {
        description: 'incomplete date',
        date: '2024-08',
    },
    {
        description: 'impossible values',
        date: '2024-13-32',
    },
    {
        description: 'with special characters',
        date: '2024/08-25@10:30',
    },
    {
        description: 'incorrect time format',
        date: '2024-08-25 25:61:61',
    },
    {
        description: 'empty string',
        date: '',
    },
    {
        description: 'only numbers',
        date: '20240825',
    },
]

export const invalidType = [
    {
        description: 'lowercase type',
        type: 'earning',
    },
    {
        description: 'with special characters',
        type: 'EARNING@',
    },
    {
        description: 'non-existent type',
        type: 'SAVINGS',
    },
    {
        description: 'empty string',
        type: '',
    },
    {
        description: 'with trailing spaces',
        type: 'EARNING ',
    },
    {
        description: 'with spaces in between',
        type: 'EARN ING',
    },
    {
        description: 'with numbers',
        type: 'EARNING123',
    },
    {
        description: 'partially correct',
        type: 'EXPENS',
    },
    {
        description: 'with mixed case',
        type: 'EaRnInG',
    },
    {
        description: 'numeric value',
        type: 1,
    },
]

export const invalidAmount = [
    // {
    //     description: 'zero value',
    //     amount: 0,
    // },
    {
        description: 'negative value',
        amount: -10.5,
    },
    {
        description: 'string value',
        amount: '10.50',
    },
    {
        description: 'empty string',
        amount: '',
    },
    {
        description: 'brazilian format',
        amount: '10,50',
    },
    {
        description: 'with thousand separator',
        amount: '1,000.50',
    },
    {
        description: 'with non-numeric characters',
        amount: '10.50a',
    },
    {
        description: 'extremely large value',
        amount: 99999999999999999999999999999999999999.99,
    },
    {
        description: 'boolean value',
        amount: true,
    },
    {
        description: 'array value',
        amount: [10.5],
    },
    {
        description: 'object value',
        amount: { value: 10.5 },
    },
]
