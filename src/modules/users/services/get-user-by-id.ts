import { PostgresGetUserByIdRepository } from '@/repositories/postgres/users/get-user-by-id'

export class GetUserByIdService {
    async execute(userId: string) {
        const getUserByIdRepository = new PostgresGetUserByIdRepository()
        return await getUserByIdRepository.execute(userId)
    }
}
