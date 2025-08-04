import { prisma } from '../../../../prisma/prisma'

export class PostgresGetUserByEmailRepository {
    async execute(email: string): Promise<any> {
        return await prisma.user.findUnique({
            where: {
                email,
            },
        })
    }
}
