import { prisma } from '../../../../prisma/prisma';
export class PostgresCreateUserRepository {
    // como nomenclatura, podemos usar execute, handle ou até create
    async execute(createUserParams) {
        return await prisma.user.create({
            data: createUserParams,
        });
    }
}
//# sourceMappingURL=create-user.js.map