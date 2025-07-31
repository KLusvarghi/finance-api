export class DeleteUserService {
    deletedUserRepository;
    constructor(deletedUserRepository) {
        this.deletedUserRepository = deletedUserRepository;
    }
    async execute(userId) {
        const userDeleted = await this.deletedUserRepository.execute(userId);
        return userDeleted;
    }
}
