import { prisma } from '../../../../prisma/prisma'
export class PostgresGetUserByEmailRepository {
    async execute(email) {
        return await prisma.user.findUnique({
            where: {
                email,
            },
        })
    }
}
//# sourceMappingURL=get-user-by-email.js.map
