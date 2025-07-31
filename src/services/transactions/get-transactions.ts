import { userNotFoundResponse } from '@/controllers/_helpers'
import { UserNotFoundError } from '@/errors/user'

interface GetUserByIdRepository {
    execute(userId: string): Promise<any>
}

interface GetTransactionByUserIdRepository {
    execute(userId: string): Promise<any>
}

export class GetTransactionByUserId {
    private getUserByIdRepository: GetUserByIdRepository
    private getTransactionRepository: GetTransactionByUserIdRepository

    constructor(
        getUserByIdRepository: GetUserByIdRepository,
        getTransactionRepository: GetTransactionByUserIdRepository,
    ) {
        this.getUserByIdRepository = getUserByIdRepository
        this.getTransactionRepository = getTransactionRepository
    }

    async execute(userId: string) {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transaction = await this.getTransactionRepository.execute(userId)

        return transaction
    }
}
