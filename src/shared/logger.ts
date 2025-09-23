interface LogContext {
    [key: string]: unknown
}

interface Logger {
    info(message: string, context?: LogContext): void
    warn(message: string, context?: LogContext): void
    error(message: string, context?: LogContext): void
    debug(message: string, context?: LogContext): void
}

class StructuredLogger implements Logger {
    private formatMessage(
        level: string,
        message: string,
        context?: LogContext,
    ): string {
        const timestamp = new Date().toISOString()
        const logEntry = {
            timestamp,
            level,
            message,
            ...(context && { context }),
        }
        return JSON.stringify(logEntry)
    }

    info(message: string, context?: LogContext): void {
        console.log(this.formatMessage('INFO', message, context))
    }

    warn(message: string, context?: LogContext): void {
        console.warn(this.formatMessage('WARN', message, context))
    }

    error(message: string, context?: LogContext): void {
        console.error(this.formatMessage('ERROR', message, context))
    }

    debug(message: string, context?: LogContext): void {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG === 'true'
        ) {
            console.debug(this.formatMessage('DEBUG', message, context))
        }
    }
}

export const logger = new StructuredLogger()
export type { LogContext, Logger }
