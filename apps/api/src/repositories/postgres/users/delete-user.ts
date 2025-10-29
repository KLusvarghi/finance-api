import { Prisma } from '@prisma/client'

import { UserNotFoundError } from '@/errors'
import { DeleteUserRepository, UserRepositoryResponse } from '@/shared'

import { prisma } from '../../../../prisma/prisma'

export class PostgresDeleteUserRepository implements DeleteUserRepository {
    async execute(userId: string): Promise<UserRepositoryResponse> {
        try {
            return await prisma.user.delete({ where: { id: userId } })
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new UserNotFoundError(userId)
            }
            throw error
        }
    }
}

// Alias para manter compatibilidade com as importações
export { PostgresDeleteUserRepository as DeleteUserRepository }
