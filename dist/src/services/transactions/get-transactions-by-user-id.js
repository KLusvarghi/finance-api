import { UserNotFoundError } from '@/errors/user';
export class GetTransactionsByUserIdService {
    getUserByIdRepository;
    getTransactionsByUserIdRepository;
    constructor(getUserByIdRepository, getTransactionsByUserIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository;
        this.getTransactionsByUserIdRepository = getTransactionsByUserIdRepository;
    }
    async execute(userId) {
        const user = await this.getUserByIdRepository.execute(userId);
        if (!user) {
            throw new UserNotFoundError(userId);
        }
        const transactions = await this.getTransactionsByUserIdRepository.execute(userId);
        return transactions;
    }
}
//# sourceMappingURL=get-transactions-by-user-id.js.map