import { ErrorCode } from './enum'

export abstract class AppError extends Error {
    public readonly code: ErrorCode

    protected constructor(message: string, code: ErrorCode) {
        super(message)
        this.code = code
        this.name = new.target.name
    }
}
