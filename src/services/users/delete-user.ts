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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
    }
}
