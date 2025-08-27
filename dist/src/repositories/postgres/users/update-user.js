import { prisma } from '../../../../prisma/prisma'
import { UserNotFoundError } from '@/errors'
import { Prisma } from '@prisma/client'
export class PostgresUpdateUserRepository {
    async execute(userId, updateParams) {
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
//# sourceMappingURL=update-user.js.map
