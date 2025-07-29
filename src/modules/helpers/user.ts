import isEmail from 'validator/lib/isEmail'
import isUUID from 'validator/lib/isUUID'
import { badRequest } from './http'

export const invalidPasswordResponse = () => badRequest('Invalid password')

export const emailIsAlreadyInUseResponse = () =>
    badRequest('Invalid e-mail. Please provide a valid one.')

export const invalidIdResponse = () =>
    badRequest('The provider id is not valid.')



export const checkIfPasswordIsValid = (password: string) =>
    password.trim().length >= 6

export const checkIfEmailIsValid = (email: string) => isEmail(email)

export const checkIfIdIsValid = (id: string) => isUUID(id)
