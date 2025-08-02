import { UserNotFoundError } from '@/errors/user';
export class GetTransactionsByUserIdService {
    getUserByIdRepository;
    getTransactionByUserIdRepository;
    constructor(getUserByIdRepository, getTransactionByUserIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository;
        this.getTransactionByUserIdRepository = getTransactionByUserIdRepository;
    }
    async execute(userId) {
        const user = await this.getUserByIdRepository.execute(userId);
        if (!user) {
            throw new UserNotFoundError();
        }
        const transaction = await this.getTransactionByUserIdRepository.execute(userId);
        return transaction;
    }
}
