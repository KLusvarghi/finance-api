import { AppError } from './app-error'
import { ErrorCode } from './enum'

export class TransactionNotFoundError extends AppError {
    constructor(transactionId: string) {
        super(
            `Transaction with id ${transactionId} not found`,
            ErrorCode.TRANSACTION_NOT_FOUND,
        )
    }
}

export class TransactionUpdateFailedError extends AppError {
    constructor(msg = 'Failed to update transaction.') {
        super(msg, ErrorCode.TRANSACTION_UPDATE_FAILED)
    }
}

export class TransactionDeleteFailedError extends AppError {
    constructor(msg = 'Failed to delete transaction.') {
        super(msg, ErrorCode.TRANSACTION_DELETE_FAILED)
    }
}
