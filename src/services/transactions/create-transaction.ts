import { IdGeneratorAdapter } from '@/adapters'
import { UserNotFoundError } from '@/errors'
import {
    CreateTransactionServiceParams,
    Service,
    TransactionPublicResponse,
} from '@/shared'
import { CreateTransactionRepository, GetUserByIdRepository } from '@/shared'

export class CreateTransactionService
    implements
        Service<CreateTransactionServiceParams, TransactionPublicResponse>
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

        return transaction
    }
}
