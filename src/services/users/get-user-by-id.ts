interface GetUserByIdRepository {
    execute(userId: string): Promise<any>
}

export class GetUserByIdService {
    private getUserByIdRepository: GetUserByIdRepository

    constructor(getUserByIdRepository: GetUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(userId: string) {
        const user = await this.getUserByIdRepository.execute(userId)

        return user
    }
}
