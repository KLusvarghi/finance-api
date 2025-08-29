export class TokenGenerationError extends Error {
    constructor(
        message: string,
        public readonly originalError?: Error,
        public readonly code: string = 'TOKEN_GENERATION_FAILED',
    ) {
        super(message)
        this.name = 'TokenGenerationError'
    }
}
