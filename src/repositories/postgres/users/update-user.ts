import { prisma } from '../../../../prisma/prisma'

export class PostgresUpdateUserRepository {
    async execute(userId: string, upadetParams: any) {
        return await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...upadetParams,
            },
        })
    }
}
