import { CreateTransactionParamsProps } from '@/controllers/_types'
import { UserNotFoundError } from '@/errors/user'
import { v4 as uuidv4 } from 'uuid'

interface CreateTransactionRepository {
    execute(params: any): Promise<any>
}

interface GetUserByIdRepository {
    execute(userId: string): Promise<any>
}

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

    async execute(params: CreateTransactionParamsProps) {
        const userId = params.user_id

        console.log(typeof params.amount)

        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = uuidv4()

        const transaction = await this.createTransactionRepository.execute({
            ...params,
            id: transactionId,
        })

        return transaction
    }
}
