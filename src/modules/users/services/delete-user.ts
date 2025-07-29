import { PostgresDeleteUserRepository } from '@/repositories/postgres/users/delete-user'

export class DeleteUserService {
    async execute(userId: string) {
        const DeleteUserRepository = new PostgresDeleteUserRepository()
        return await DeleteUserRepository.execute(userId)
    }
}
