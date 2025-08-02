import { TransactionNotFoundError } from "@/errors/user";
export class UpdateTransactionService {
    updateTransactionRepository;
    getUserByIdRepository;
    constructor(updateTransactionRepository, getUserByIdRepository) {
        this.updateTransactionRepository = updateTransactionRepository;
        this.getUserByIdRepository = getUserByIdRepository;
    }
    async execute(transactionId, params) {
        const transaction = await this.updateTransactionRepository.execute(transactionId, params);
        if (!transactionId) {
            return TransactionNotFoundError;
        }
        return transaction;
    }
}
