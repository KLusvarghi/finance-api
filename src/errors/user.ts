export class EmailAlreadyExistsError extends Error {
    constructor(email: string) {
        super(`The e-mail ${email} is already in use.`)
        this.name = 'EmailAlreadyExistsError' // assim a gente deixa mais claro o name do error
    }
}

export class UserNotFoundError extends Error {
    constructor(userId: string) {
        super(`User with id ${userId} not found`)
        this.name = 'UserNotFoundError'
    }
}

export class TransactionNotFoundError extends Error {
    constructor(transactionId: string) {
        super(`Transaction with id ${transactionId} not found`)
        this.name = 'TransactionNotFoundError'
    }
}

export class UpdateUserFailedError extends Error {
  constructor (msg = 'Failed to update user.') {
    super(msg)
    this.name = 'UpdateUserFailedError'
  }
}
