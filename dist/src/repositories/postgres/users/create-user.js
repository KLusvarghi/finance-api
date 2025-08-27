import { prisma } from '../../../../prisma/prisma'
export class PostgresCreateUserRepository {
    async execute(createUserParams) {
        return await prisma.user.create({ data: createUserParams })
    }
}
//# sourceMappingURL=create-user.js.map
