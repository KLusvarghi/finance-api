import { UserNotFoundError } from '@/errors'
import { DeleteUserRepository } from '@/repositories/postgres'
import { Service, UserPublicResponse } from '@/shared'

export class DeleteUserService implements Service<string, UserPublicResponse> {
    constructor(private readonly deletedUserRepository: DeleteUserRepository) {}

    async execute(userId: string): Promise<UserPublicResponse> {
        const user = await this.deletedUserRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }
        const { password: _password, ...userWithoutPassword } = user
        return userWithoutPassword
    }
}
