interface DeleteTransactionRepository {
    execute(transactionId: string): Promise<any>
}

export class DeleteTransactionService {
    private deleteTransactionRepository: DeleteTransactionRepository

    constructor(deleteTransactionRepository: DeleteTransactionRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository
    }

    async execute(transactionId: string) {
        const transactionDeleted =
            await this.deleteTransactionRepository.execute(transactionId)
        return transactionDeleted
    }
}
