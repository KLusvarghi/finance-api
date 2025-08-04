import { Prisma } from '@prisma/client'
import { prisma } from '../../../../prisma/prisma'

export class PostgresDeleteUserRepository {
    async execute(userId: string): Promise<Prisma.UserGetPayload<{}> | null> {
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
