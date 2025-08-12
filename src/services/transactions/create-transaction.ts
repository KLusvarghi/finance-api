import {
    CreateTransactionParams,
    TransactionPublicResponse,
} from '@/shared/types'
import { UserNotFoundError } from '@/errors/user'
import {
    CreateTransactionRepository,
    GetUserByIdRepository,
} from '@/shared/types'
import { IdGeneratorAdapter } from '@/adapters'

export class CreateTransactionService {
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
