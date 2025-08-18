import { prisma } from '../../../../prisma/prisma'

import { CreateUserParams,UserRepositoryResponse } from '@/shared'

export class PostgresCreateUserRepository {
    // como nomenclatura, podemos usar execute, handle ou até create
    async execute(
        createUserParams: CreateUserParams & { id: string; password: string },
    ): Promise<UserRepositoryResponse> {
        return await prisma.user.create({ data: createUserParams })
    }
}
