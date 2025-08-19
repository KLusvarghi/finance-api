export const ResponseMessage = {
    // Usuário
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    USER_NOT_FOUND: 'User not found',
    USER_ID_MISSING: 'User id is required',

    // Transações
    TRANSACTION_CREATED: 'Transaction created successfully',
    TRANSACTION_UPDATED: 'Transaction updated successfully',
    TRANSACTION_DELETED: 'Transaction deleted successfully',
    TRANSACTION_NOT_FOUND: 'Transaction not found',
    TRANSACTION_ID_MISSING: 'Transaction id is required',

    // Genéricas
    SUCCESS: 'Operation completed successfully',
    ERROR: 'error',
    NOT_FOUND: 'Resource not found',
    SERVER_ERROR: 'Internal server error',
    BAD_REQUEST: 'Bad request',
    INVALID_ID: 'The provider id is not valid',
} as const

// export type ResponseMessageKey = keyof typeof ResponseMessage

export const ResponseZodMessages = {
    id: {
        required: 'User id is required',
        invalid: 'User id must be a valid uuid',
    },
    name: {
        required: 'Name is required',
        minLength: 'Name must be at least 3 characters long',
        maxLength: 'Name must be at most 100 characters long',
    },
    date: {
        required: 'Date is required',
        invalid: 'Date must be a valid date',
    },
    type: {
        invalid: 'Type must be EARNING, EXPENSE or INVESTMENT',
    },
    amount: {
        required: 'Amount is required',
        minValue: 'Amount must be greater than 0',
        invalidCurrency: 'Amount must be a valid currency (2 decimal places)',
    },
}
