import { UserRepositoryResponse } from '@/shared/types'
import { prisma } from '../../../../prisma/prisma'

export class PostgresGetUserByIdRepository {
    async execute(userId: string): Promise<UserRepositoryResponse | null> {
        return await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })
    }
}
