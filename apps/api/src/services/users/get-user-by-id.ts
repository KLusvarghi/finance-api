import { UserNotFoundError } from '@/errors'
import { GetUserByIdRepository } from '@/repositories/postgres'
import { SimpleService, UserPublicResponse } from '@/shared'

export class GetUserByIdService
    implements SimpleService<string, UserPublicResponse>
{
    constructor(
        private readonly getUserByIdRepository: GetUserByIdRepository,
    ) {}

    async execute(userId: string): Promise<UserPublicResponse> {
        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }
        const { password: _password, ...userWithoutPassword } = user
        return userWithoutPassword
    }
}
