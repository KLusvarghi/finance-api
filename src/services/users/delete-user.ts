import { UserNotFoundError } from '@/errors'
import { DeleteUserRepository, Service, UserPublicResponse } from '@/shared'

// export class DeleteUserService implements Service<string, UserPublicResponse> {
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

        const { password: _password, ...userWithoutPassword } = user
        return userWithoutPassword
    }
}
