import { prisma } from '../../../../prisma/prisma'

import { UserRepositoryResponse } from '@/shared'

export class PostgresGetUserByIdRepository {
    async execute(userId: string): Promise<UserRepositoryResponse | null> {
        return prisma.user.findUnique({ where: { id: userId } })
    }
}
