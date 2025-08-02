import { UserNotFoundError } from "@/errors/user"

interface GetUserByIdRepository {
    execute(userId: string): Promise<any>
}

interface GetUserBalanceRepository {
    execute(userId: string): Promise<any>
}

export class GetUserBalanceService {
    private getUserByIdRepository: GetUserByIdRepository
    private getUserBalanceRepository: GetUserBalanceRepository

    constructor(
        getUserByIdRepository: GetUserByIdRepository,
        getUserBalanceRepository: GetUserBalanceRepository,
    ){
      this.getUserByIdRepository = getUserByIdRepository
      this.getUserBalanceRepository = getUserBalanceRepository
    }

    async execute(params: any){
      const user = await this.getUserByIdRepository.execute(params.userId)

      if(!user){
        throw new UserNotFoundError()
      }

      const userBalance = await this.getUserBalanceRepository.execute(params.userId)
      
      return userBalance
    }
}
