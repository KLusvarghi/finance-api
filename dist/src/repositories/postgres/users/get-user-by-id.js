import { prisma } from '../../../../prisma/prisma';
export class PostgresGetUserByIdRepository {
    async execute(userId) {
        return await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
    }
}
//# sourceMappingURL=get-user-by-id.js.map