import { UserNotFoundError } from '@/errors/user'
import {
    GetUserByIdRepository,
    GetTransactionsByUserIdRepository,
    TransactionPublicResponse,
} from '@/shared/types'

export class GetTransactionsByUserIdService {
    private getUserByIdRepository: GetUserByIdRepository
    private getTransactionsByUserIdRepository: GetTransactionsByUserIdRepository

    constructor(
        getUserByIdRepository: GetUserByIdRepository,
        getTransactionsByUserIdRepository: GetTransactionsByUserIdRepository,
    ) {
        this.getUserByIdRepository = getUserByIdRepository
        this.getTransactionsByUserIdRepository = getTransactionsByUserIdRepository
    }

    async execute(userId: string): Promise<TransactionPublicResponse[]> {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactions =
            await this.getTransactionsByUserIdRepository.execute(userId)

        return transactions
    }
}
