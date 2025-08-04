import { Prisma } from '@prisma/client'
import { prisma } from '../../../../prisma/prisma'
import { UserRepositoryResponse, CreateUserParams } from '@/shared/types'

export class PostgresCreateUserRepository {
    // como nomenclatura, podemos usar execute, handle ou até create
    async execute(
        createUserParams: CreateUserParams,
    ): Promise<UserRepositoryResponse> {
        return await prisma.user.create({
            data: createUserParams,
        })
    }
}
