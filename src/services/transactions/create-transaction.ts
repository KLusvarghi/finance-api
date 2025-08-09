import { CreateTransactionParams } from '@/shared/types'
import { UserNotFoundError } from '@/errors/user'
import { v4 as uuidv4 } from 'uuid'
import {
    CreateTransactionRepository,
    GetUserByIdRepository,
    TransactionRepositoryResponse,
} from '@/shared/types'

export class CreateTransactionService {
    private createTransactionRepository: CreateTransactionRepository
    private getUserByIdRepository: GetUserByIdRepository

    constructor(
        createTransactionRepository: CreateTransactionRepository,
        getUserByIdRepository: GetUserByIdRepository,
    ) {
        this.createTransactionRepository = createTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(
        params: CreateTransactionParams,
    ): Promise<TransactionRepositoryResponse> {
        const user = await this.getUserByIdRepository.execute(params.user_id)

        if (!user) {
            throw new UserNotFoundError(params.user_id)
        }

        const transactionId = uuidv4()

        const transaction = await this.createTransactionRepository.execute({
            ...params,
            id: transactionId,
        })

        return transaction
    }
}
