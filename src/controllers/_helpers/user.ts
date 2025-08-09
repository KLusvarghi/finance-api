import { badRequest, notFound } from './http'

export const userNotFoundResponse = (message?: string) => {
    if (message) {
        return notFound(message)
    }
    return notFound('User not found')
}

export const userBadRequestResponse = () => badRequest('Missing param: userId')
