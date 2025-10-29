import { ResponseZodMessages } from '@/shared'

export const invalidAmountCases = [
    {
        description: 'zero value',
        amount: 0,
        expectedMessage: ResponseZodMessages.amount.minValue,
    },
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
        // Using a large number that won't lose precision but still exceeds currency limits
        amount: 9999999999999.99,
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
