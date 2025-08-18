import { ResponseMessage, ResponseZodMessages } from "@/shared"

export const invalidUUID = [
    {
        description: 'too long',
        id: '12345678-1234-1234-1234-123456789012',
        expectedMessage: ResponseMessage.INVALID_ID,
    },
    {
        description: 'too short',
        id: '12345678-1234-1234-1234-12345678901',
        expectedMessage: ResponseMessage.INVALID_ID,
    },
    {
        description: 'with invalid characters',
        id: '12345678-1234-1234-1234-12345678901g',
        expectedMessage: ResponseMessage.INVALID_ID,
    },
    {
        description: 'without hyphens',
        id: '12345678-1234-1234-1234-12345678901',
        expectedMessage: ResponseMessage.INVALID_ID,
    },
    {
        description: 'completely invalid format',
        id: 'not-a-uuid-at-all',
        expectedMessage: ResponseMessage.INVALID_ID,
    },
    // {
    //     description: 'empty string',
    //     id: '',
    //     expectedMessage: ResponseMessage.,
    // },
]

export const invalidDate = [
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
        description: 'empty string',
        date: '',
        expectedMessage: ResponseZodMessages.date.required,
    },
    {
        description: 'only numbers',
        date: '20240825',
        expectedMessage: ResponseZodMessages.date.invalid,
    },
]

export const invalidType = [
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

export const invalidAmount = [
    // {
    //     description: 'zero value',
    //     amount: 0,
    //     expectedMessage: ResponseZodMessages.amount.minValue,
    // },
    {
        description: 'negative value',
        amount: -10.5,
        expectedMessage: ResponseZodMessages.amount.minValue,
    },
    {
        description: 'string value',
        amount: '10.50',
        expectedMessage: ResponseZodMessages.amount.required,
    },
    {
        description: 'empty string',
        amount: '',
        expectedMessage: ResponseZodMessages.amount.required,
    },
    {
        description: 'brazilian format',
        amount: '10,50',
        expectedMessage: ResponseZodMessages.amount.required,
    },
    {
        description: 'with thousand separator',
        amount: '1,000.50',
        expectedMessage: ResponseZodMessages.amount.required,
    },
    {
        description: 'with non-numeric characters',
        amount: '10.50a',
        expectedMessage: ResponseZodMessages.amount.required,
    },
    {
        description: 'extremely large value',
        amount: 99999999999999999999999999999999999999.99,
        expectedMessage: ResponseZodMessages.amount.invalidCurrency,
    },
    {
        description: 'boolean value',
        amount: true,
        expectedMessage: ResponseZodMessages.amount.required,
    },
    {
        description: 'array value',
        amount: [10.5],
        expectedMessage: ResponseZodMessages.amount.required,
    },
    {
        description: 'object value',
        amount: { value: 10.5 },
        expectedMessage: ResponseZodMessages.amount.required,
    },
]
