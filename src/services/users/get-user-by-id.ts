import { UserNotFoundError } from '@/errors/user'
import { GetUserByIdRepository, UserRepositoryResponse } from '@/shared/types'

export class GetUserByIdService {
    private getUserByIdRepository: GetUserByIdRepository

    constructor(getUserByIdRepository: GetUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(userId: string): Promise<UserRepositoryResponse> {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        return user
    }
}
