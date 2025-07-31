import { UserNotFoundError } from "@/errors/user"

interface UpdateTransactionRepository {
    execute(userId: string): Promise<any>
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

    async execute(params: any){
      const user = await this.getUserByIdRepository.execute(params.userId)

      if(!user){
        throw new UserNotFoundError()
      }

      const transaction = await this.updateTransactionRepository.execute(params.userId)

      return transaction
    }
}
