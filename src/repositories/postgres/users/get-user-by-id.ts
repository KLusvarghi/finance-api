import { prisma } from '../../../../prisma/prisma'

import { GetUserByIdRepository, UserRepositoryResponse } from '@/shared'

export class PostgresGetUserByIdRepository implements GetUserByIdRepository {
    async execute(userId: string): Promise<UserRepositoryResponse | null> {
        return prisma.user.findUnique({ where: { id: userId } })
    }
}

// Alias para manter compatibilidade com as importações
export { PostgresGetUserByIdRepository as GetUserByIdRepository }
