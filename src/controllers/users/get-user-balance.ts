import { ZodError } from 'zod'

import {
    handleZodValidationError,
    notFoundResponse,
    ok,
    serverError,
} from '../_helpers'

import { UserNotFoundError } from '@/errors'
import { getUserBalanceSchema } from '@/schemas'
import {
    GetUserBalanceRequest,
    GetUserBalanceService,
    HeadersController,
    HttpResponse,
    UserBalanceRepositoryResponse,
    UserIdRequestParams,
} from '@/shared'

export class GetUserBalanceController
    implements
        HeadersController<UserIdRequestParams, UserBalanceRepositoryResponse>
{
    constructor(
        private readonly getUserBalanceService: GetUserBalanceService,
    ) {}

    async execute(
        httpRequest: GetUserBalanceRequest,
    ): Promise<HttpResponse<UserBalanceRepositoryResponse>> {
        try {
            const { userId } = httpRequest.headers
            const { from, to } = httpRequest.query

            await getUserBalanceSchema.parseAsync({ userId, from, to })

            const userBalance = await this.getUserBalanceService.execute(userId)

            return ok(userBalance)
        } catch (error) {
            console.error(error)
            if (error instanceof UserNotFoundError) {
                return notFoundResponse(error)
            }

            if (error instanceof ZodError) {
                return handleZodValidationError(error)
            }
            return serverError()
        }
    }
}
