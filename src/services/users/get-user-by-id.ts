import { UserNotFoundError } from '@/errors/user'
import {
    GetUserByIdRepository,
    UserPublicResponse,
} from '@/shared/types'

export class GetUserByIdService {
    private getUserByIdRepository: GetUserByIdRepository

    constructor(getUserByIdRepository: GetUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(userId: string): Promise<UserPublicResponse> {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
    }
}
