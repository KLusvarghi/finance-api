import { UserNotFoundError } from '@/errors/user';
import { v4 as uuidv4 } from 'uuid';
export class CreateTransactionService {
    createTransactionRepository;
    getUserByIdRepository;
    constructor(createTransactionRepository, getUserByIdRepository) {
        this.createTransactionRepository = createTransactionRepository;
        this.getUserByIdRepository = getUserByIdRepository;
    }
    async execute(params) {
        const userId = params.user_id;
        const user = await this.getUserByIdRepository.execute(userId);
        if (!user) {
            throw new UserNotFoundError();
        }
        const transactionId = uuidv4();
        const transaction = await this.createTransactionRepository.execute({
            ...params,
            id: transactionId,
        });
        return transaction;
    }
}
