import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

import { handleZodValidationError } from '@/controllers'
import { AppError } from '@/errors'

/**
 * Centralized error handling middleware.
 * This middleware should be registered as the LAST middleware in the Express app.
 *
 * It handles:
 * - ZodError: Validation errors from schema parsing
 * - AppError: Custom application errors (EmailAlreadyExistsError, UserNotFoundError, etc.)
 * - Generic Error: Unexpected errors (returns 500 Internal Server Error)
 */
export const errorHandler = (
    error: Error,
    _req: Request,
    res: Response,

    _next: NextFunction,
): void => {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
        const zodResponse = handleZodValidationError(error)
        res.status(zodResponse.statusCode).json(zodResponse.body)
        return
    }

    // Handle custom application errors
    if (error instanceof AppError) {
        const statusCode = getStatusCodeFromError(error)
        res.status(statusCode).json({
            success: false,
            message: error.message,
            code: error.code,
        })
        return
    }

    // Handle unexpected errors
    console.error('Unexpected error:', error)
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
    })
}

/**
 * Maps custom application errors to appropriate HTTP status codes
 */
const getStatusCodeFromError = (error: AppError): number => {
    const errorCodeToStatusMap: Record<string, number> = {
        // Authentication errors
        UNAUTHORIZED: 401,
        LOGIN_FAILED: 401,
        FORBIDDEN: 403,

        // Validation errors
        BAD_REQUEST: 400,
        USER_ID_MISSING: 400,
        USER_ID_INVALID: 400,
        TRANSACTION_ID_INVALID: 400,

        // Not found errors
        USER_NOT_FOUND: 404,
        TRANSACTION_NOT_FOUND: 404,

        // Conflict errors
        EMAIL_ALREADY_EXISTS: 409,

        // Server errors
        USER_UPDATE_FAILED: 500,
        TRANSACTION_UPDATE_FAILED: 500,
        INTERNAL_SERVER_ERROR: 500,
    }

    return errorCodeToStatusMap[error.code] || 500
}
