export class EmailAlreadyExistsError extends Error {
    constructor(email: string) {
        super(`Email ${email} already exists`)
        this.name = 'EmailAlreadyExistsError' // assim a gente deixa mais claro o name do error
    }
}
