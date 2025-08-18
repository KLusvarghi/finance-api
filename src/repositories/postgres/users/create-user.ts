import { prisma } from '../../../../prisma/prisma'

import {
    CreateUserParams,
    CreateUserRepository,
    UserRepositoryResponse,
} from '@/shared'

export class PostgresCreateUserRepository implements CreateUserRepository {
    async execute(
        createUserParams: CreateUserParams & { id: string; password: string },
    ): Promise<UserRepositoryResponse> {
        return await prisma.user.create({ data: createUserParams })
    }
}
