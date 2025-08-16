import { prisma } from '../../../../prisma/prisma';
export class PostgresUpdateUserRepository {
    async execute(userId, updateParams) {
        return await prisma.user.update({
            where: {
                id: userId,
            },
            data: updateParams,
        });
    }
}
//# sourceMappingURL=update-user.js.map