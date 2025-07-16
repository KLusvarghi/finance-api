export type HttpResponse<T = any> = {
  statusCode: number
  body: {
    status: 'success' | 'error'
    message: string
    data?: T
  } | null
}
