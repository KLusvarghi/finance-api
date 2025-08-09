import { notFound } from './http'

export const transactionNotFoundResponse = () => notFound('Transaction not found.')
