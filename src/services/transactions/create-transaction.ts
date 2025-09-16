import { IdGeneratorAdapter } from '@/adapters'
import { UserNotFoundError } from '@/errors'
import {
    CreateTransactionRepository,
    GetUserByIdRepository,
} from '@/repositories/postgres'
import {
    CreateTransactionServiceParams,
    Service,
    TransactionPublicResponse,
} from '@/shared'

export class CreateTransactionService
    implements
        Service<CreateTransactionServiceParams, TransactionPublicResponse>
{
    constructor(
        private readonly createTransactionRepository: CreateTransactionRepository,
        private readonly getUserByIdRepository: GetUserByIdRepository,
        private readonly idGenerator: IdGeneratorAdapter,
    ) {}

    async execute(
        params: CreateTransactionServiceParams,
    ): Promise<TransactionPublicResponse> {
        const user = await this.getUserByIdRepository.execute(params.userId)

        if (!user) {
            throw new UserNotFoundError(params.userId)
        }

        const transactionId = this.idGenerator.execute()

        const transaction = await this.createTransactionRepository.execute({
            ...params,
            id: transactionId,
        })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { deletedAt, ...transactionWithoutDeletedAt } = transaction
        return {
            ...transactionWithoutDeletedAt,
        }
    }
}
