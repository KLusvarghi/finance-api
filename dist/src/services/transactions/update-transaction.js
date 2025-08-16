import { TransactionNotFoundError } from '@/errors/user';
export class UpdateTransactionService {
    updateTransactionRepository;
    constructor(updateTransactionRepository) {
        this.updateTransactionRepository = updateTransactionRepository;
    }
    async execute(transactionId, params) {
        const transaction = await this.updateTransactionRepository.execute(transactionId, params);
        if (!transaction) {
            throw new TransactionNotFoundError(transactionId);
        }
        return transaction;
    }
}
//# sourceMappingURL=update-transaction.js.map