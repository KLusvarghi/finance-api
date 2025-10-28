import {
    CreateUserRepository,
    CreateUserRepositoryParams,
    UserRepositoryResponse,
} from '@/shared'

import { prisma } from '../../../../prisma/prisma'

export class PostgresCreateUserRepository implements CreateUserRepository {
    async execute(
        createUserParams: CreateUserRepositoryParams,
    ): Promise<UserRepositoryResponse> {
        return await prisma.user.create({ data: createUserParams })
    }
}

// Alias para manter compatibilidade com as importações
export { PostgresCreateUserRepository as CreateUserRepository }
