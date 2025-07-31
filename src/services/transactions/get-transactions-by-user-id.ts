import { userNotFoundResponse } from '@/controllers/_helpers'
import { UserNotFoundError } from '@/errors/user'

interface GetUserByIdRepository {
    execute(userId: string): Promise<any>
}

interface GetTransactionByUserIdRepository {
    execute(userId: string): Promise<any>
}

export class GetTransactionsByUserIdService {
    private getUserByIdRepository: GetUserByIdRepository
    private getTransactionByUserIdRepository: GetTransactionByUserIdRepository

    constructor(
        getUserByIdRepository: GetUserByIdRepository,
        getTransactionByUserIdRepository: GetTransactionByUserIdRepository,
    ) {
        this.getUserByIdRepository = getUserByIdRepository
        this.getTransactionByUserIdRepository = getTransactionByUserIdRepository
    }

    async execute(userId: string) {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError()
        }

        const transaction = await this.getTransactionByUserIdRepository.execute(userId)

        return transaction
    }
}
