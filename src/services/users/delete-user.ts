import { UserNotFoundError } from '@/errors/user'
import { DeleteUserRepository, UserRepositoryResponse } from '@/shared/types'

export class DeleteUserService {
    private deletedUserRepository: DeleteUserRepository

    constructor(deletedUserRepository: DeleteUserRepository) {
        this.deletedUserRepository = deletedUserRepository
    }

    async execute(userId: string): Promise<UserRepositoryResponse> {
        const userDeleted = await this.deletedUserRepository.execute(userId)

        if (!userDeleted) {
            throw new UserNotFoundError(userId)
        }

        return userDeleted
    }
}
