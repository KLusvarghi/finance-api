import { badRequest, notFound } from './http'

export const emailIsAlreadyInUseResponse = () =>
    badRequest('Invalid e-mail. Please provide a valid one')

export const userNotFoundResponse = (message?: string) => {
    if (message) {
        return notFound(message)
    }
    return notFound('User not found')
}

export const userBadRequestResponse = () => badRequest('Missing param: userId')
