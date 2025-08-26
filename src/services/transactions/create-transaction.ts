import { IdGeneratorAdapter } from '@/adapters'
import { UserNotFoundError } from '@/errors'
import {
    CreateTransactionParams,
    Service,
    TransactionPublicResponse,
} from '@/shared'
import { CreateTransactionRepository, GetUserByIdRepository } from '@/shared'

export class CreateTransactionService
    implements Service<CreateTransactionParams, TransactionPublicResponse>
{
    private createTransactionRepository: CreateTransactionRepository
    private getUserByIdRepository: GetUserByIdRepository
    private idGenerator: IdGeneratorAdapter

    constructor(
        createTransactionRepository: CreateTransactionRepository,
        getUserByIdRepository: GetUserByIdRepository,
        idGenerator: IdGeneratorAdapter,
    ) {
        this.createTransactionRepository = createTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
        this.idGenerator = idGenerator
    }

    async execute(
        params: CreateTransactionParams,
    ): Promise<TransactionPublicResponse> {
        const user = await this.getUserByIdRepository.execute(params.user_id)

        if (!user) {
            throw new UserNotFoundError(params.user_id)
        }

        const transactionId = this.idGenerator.execute()

        const transaction = await this.createTransactionRepository.execute({
            ...params,
            id: transactionId,
        })

        return transaction
    }
}
