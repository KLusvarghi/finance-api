import { badRequest, notFound } from './http'

export const emailIsAlreadyInUseResponse = () =>
    badRequest('Invalid e-mail. Please provide a valid one.')

export const userNotFoundResponse = (message?: string) =>
    notFound(message ? message : 'User not found.')

export const userBadRequestResponse = () => notFound('Missing param: userId.')
