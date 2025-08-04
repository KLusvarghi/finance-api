import { GetUserByIdRepository, UserRepositoryResponse } from '@/shared/types'

export class GetUserByIdService {
    private getUserByIdRepository: GetUserByIdRepository

    constructor(getUserByIdRepository: GetUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(userId: string): Promise<UserRepositoryResponse | null> {
        const user = await this.getUserByIdRepository.execute(userId)

        return user
    }
}
