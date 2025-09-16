import { prisma } from '../../../../prisma/prisma'

import { UserNotFoundError } from '@/errors'
import {
    UpdateUserParams,
    UpdateUserRepository,
    UserRepositoryResponse,
} from '@/shared'
import { Prisma } from '@prisma/client'

export class PostgresUpdateUserRepository implements UpdateUserRepository {
    async execute(
        userId: string,
        updateParams: UpdateUserParams,
    ): Promise<UserRepositoryResponse> {
        try {
            return prisma.user.update({
                where: { id: userId },
                data: updateParams,
            })
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
export { PostgresUpdateUserRepository as UpdateUserRepository }
