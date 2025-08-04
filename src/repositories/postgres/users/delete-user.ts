import { prisma } from '../../../../prisma/prisma'

export class PostgresDeleteUserRepository {
    async execute(userId: string) {
        return await prisma.user.delete({
            where: {
                id: userId,
            },
        })
    }
}
