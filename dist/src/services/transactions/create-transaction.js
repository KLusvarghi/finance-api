import { UserNotFoundError } from '@/errors/user';
export class CreateTransactionService {
    createTransactionRepository;
    getUserByIdRepository;
    idGenerator;
    constructor(createTransactionRepository, getUserByIdRepository, idGenerator) {
        this.createTransactionRepository = createTransactionRepository;
        this.getUserByIdRepository = getUserByIdRepository;
        this.idGenerator = idGenerator;
    }
    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.user_id);
        if (!user) {
            throw new UserNotFoundError(params.user_id);
        }
        const transactionId = this.idGenerator.execute();
        const transaction = await this.createTransactionRepository.execute({
            ...params,
            id: transactionId,
        });
        return transaction;
    }
}
//# sourceMappingURL=create-transaction.js.map