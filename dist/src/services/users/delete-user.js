import { UserNotFoundError } from '@/errors'
export class DeleteUserService {
    deletedUserRepository
    constructor(deletedUserRepository) {
        this.deletedUserRepository = deletedUserRepository
    }
    async execute(userId) {
        const user = await this.deletedUserRepository.execute(userId)
        if (!user) {
            throw new UserNotFoundError(userId)
        }
        const { password: _password, ...userWithoutPassword } = user
        return userWithoutPassword
    }
}
//# sourceMappingURL=delete-user.js.map
