import { UserNotFoundError } from '@/errors'
import {
    GetUserByIdRepository,
    SimpleService,
    UserPublicResponse,
} from '@/shared'

export class GetUserByIdService
    implements SimpleService<string, UserPublicResponse>
{
    private getUserByIdRepository: GetUserByIdRepository

    constructor(getUserByIdRepository: GetUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(userId: string): Promise<UserPublicResponse> {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const { password: _password, ...userWithoutPassword } = user
        return userWithoutPassword
    }
}
