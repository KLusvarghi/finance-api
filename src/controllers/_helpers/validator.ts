import isUUID from 'validator/lib/isUUID'
import { badRequest } from './http'

export const checkIfIdIsValid = (id: string) => isUUID(id)

export const invalidIdResponse = () =>
  badRequest('The provider id is not valid.')
