export class DeleteUserService {
    constructor(deletedUserRepository: any) {
        this.deletedUserRepository = deletedUserRepository
    }
    async execute(userId: string) {
        const userDeleted = await this.deletedUserRepository.execute(userId)
        return userDeleted
    }
}
