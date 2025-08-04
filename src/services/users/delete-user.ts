import { DeleteUserRepository, UserRepositoryResponse } from '@/shared/types'

export class DeleteUserService {
    private deletedUserRepository: DeleteUserRepository

    constructor(deletedUserRepository: DeleteUserRepository) {
        this.deletedUserRepository = deletedUserRepository
    }

    async execute(userId: string): Promise<UserRepositoryResponse | null> {
        const userDeleted = await this.deletedUserRepository.execute(userId)
        return userDeleted
    }
}
