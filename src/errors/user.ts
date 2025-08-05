export class EmailAlreadyExistsError extends Error {
    constructor(email: string) {
      super(`The e-mail ${email} is already in use.`)
      this.name = 'EmailAlreadyExistsError' // assim a gente deixa mais claro o name do error
    }
}

export class UserNotFoundError extends Error {
  constructor() {
      super(`User not found`)
      this.name = 'UserNotFoundError' // assim a gente deixa mais claro o name do error
  }
}

export class TransactionNotFoundError extends Error {
  constructor() {
      super(`Transaction not found`)
      this.name = 'TransactionNotFoundError' // assim a gente deixa mais claro o name do error
  }
}
