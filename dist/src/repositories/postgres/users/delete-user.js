import { prisma } from '../../../../prisma/prisma'
import { UserNotFoundError } from '@/errors'
import { Prisma } from '@prisma/client'
export class PostgresDeleteUserRepository {
    async execute(userId) {
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
//# sourceMappingURL=delete-user.js.map
