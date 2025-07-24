export class EmailAlreadyExistsError extends Error {
    constructor(email: string) {
        super(`Email ${email} already exists`)
        this.name = 'EmailAlreadyExistsError'
    }
}