import { Prisma } from '@prisma/client'
import { prisma } from '../../../../prisma/prisma'

type CreateUserParams = Omit<Prisma.UserCreateInput, 'id' | 'transactions'>

export class PostgresCreateUserRepository {
    // como nomenclatura, podemos usar execute, handle ou até create
    async execute(
        createUserParams: CreateUserParams,
    ): Promise<Prisma.UserGetPayload<{}>> {
        return await prisma.user.create({
            data: createUserParams,
        })
    }
}
