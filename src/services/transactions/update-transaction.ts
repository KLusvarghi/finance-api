import { TransactionNotFoundError } from "@/errors/user"

interface UpdateTransactionRepository {
    execute(transactionId: string, params: string): Promise<any>
}

interface GetUserByIdRepository {
    execute(userId: string): Promise<any>
}

export class UpdateTransactionService {
    private updateTransactionRepository: UpdateTransactionRepository
    private getUserByIdRepository: GetUserByIdRepository

    constructor(
        updateTransactionRepository: UpdateTransactionRepository,
        getUserByIdRepository: GetUserByIdRepository,
    ) {
        this.updateTransactionRepository = updateTransactionRepository
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(transactionId: string, params: any) {
        const transaction = await this.updateTransactionRepository.execute(
            transactionId,
            params,
        )

        if(!transactionId){
          return TransactionNotFoundError
        }

        return transaction
    }
}
