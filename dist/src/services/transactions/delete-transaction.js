import { TransactionNotFoundError } from '@/errors/user';
export class DeleteTransactionService {
    deleteTransactionRepository;
    constructor(deleteTransactionRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository;
    }
    async execute(transactionId) {
        const transactionDeleted = await this.deleteTransactionRepository.execute(transactionId);
        if (!transactionDeleted) {
            throw new TransactionNotFoundError(transactionId);
        }
        return transactionDeleted;
    }
}
//# sourceMappingURL=delete-transaction.js.map