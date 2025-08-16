import { UserNotFoundError } from '@/errors/user';
export class GetUserByIdService {
    getUserByIdRepository;
    constructor(getUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository;
    }
    async execute(userId) {
        const user = await this.getUserByIdRepository.execute(userId);
        if (!user) {
            throw new UserNotFoundError(userId);
        }
        const { password: _password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
//# sourceMappingURL=get-user-by-id.js.map