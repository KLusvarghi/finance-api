import { UserNotFoundError } from '@/errors/user'
import { DeleteUserRepository, UserPublicResponse } from '@/shared/types'

export class DeleteUserService {
    private deletedUserRepository: DeleteUserRepository

    constructor(deletedUserRepository: DeleteUserRepository) {
        this.deletedUserRepository = deletedUserRepository
    }

    async execute(userId: string): Promise<UserPublicResponse> {
        const user = await this.deletedUserRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        }
    }
}
