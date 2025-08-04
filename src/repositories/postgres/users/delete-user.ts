import { prisma } from '../../../../prisma/prisma'
import { UserRepositoryResponse } from '@/shared/types'

export class PostgresDeleteUserRepository {
    async execute(userId: string): Promise<UserRepositoryResponse | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            return null
        }

        return await prisma.user.delete({
            where: {
                id: userId,
            },
        })
    }
}
