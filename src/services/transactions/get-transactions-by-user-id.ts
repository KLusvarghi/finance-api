import { UserNotFoundError } from '@/errors/user'
import {
    GetUserByIdRepository,
    GetTransactionsByUserIdRepository,
    TransactionPublicResponse,
} from '@/shared/types'

export class GetTransactionsByUserIdService {
    private getUserByIdRepository: GetUserByIdRepository
    private getTransactionByUserIdRepository: GetTransactionsByUserIdRepository

    constructor(
        getUserByIdRepository: GetUserByIdRepository,
        getTransactionByUserIdRepository: GetTransactionsByUserIdRepository,
    ) {
        this.getUserByIdRepository = getUserByIdRepository
        this.getTransactionByUserIdRepository = getTransactionByUserIdRepository
    }

    async execute(userId: string): Promise<TransactionPublicResponse[]> {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactions =
            await this.getTransactionByUserIdRepository.execute(userId)

        return transactions || []
    }
}
