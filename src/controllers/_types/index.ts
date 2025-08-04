import { TransctionType } from '@prisma/client'

export interface CreateUserParams {
  first_name: string
  last_name: string
  email: string
  password: string
}

export type HttpResponse<T = any> = {
  statusCode: number
  body: {
    status: 'success' | 'error'
    message: string
    data?: T
  } | null
}

export interface CreateTransactionParamsProps {
  user_id: string
  name: string
  amount: number
  date: Date
  type: TransctionType
}
