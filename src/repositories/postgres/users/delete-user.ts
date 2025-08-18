import { prisma } from '../../../../prisma/prisma'

import { UserNotFoundError } from '@/errors'
import { UserRepositoryResponse } from '@/shared'
import { Prisma } from '@prisma/client'

export class PostgresDeleteUserRepository {
    async execute(userId: string): Promise<UserRepositoryResponse> {
        try {
            return prisma.user.delete({ where: { id: userId } })
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
