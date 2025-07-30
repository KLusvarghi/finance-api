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
