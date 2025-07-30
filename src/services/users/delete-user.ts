interface DeleteUserRepository {
    execute(userId: string): Promise<any>
}

export class DeleteUserService {
    private deletedUserRepository: DeleteUserRepository

    constructor(deletedUserRepository: DeleteUserRepository) {
        this.deletedUserRepository = deletedUserRepository
    }
    async execute(userId: string) {
        const userDeleted = await this.deletedUserRepository.execute(userId)
        return userDeleted
    }
}
