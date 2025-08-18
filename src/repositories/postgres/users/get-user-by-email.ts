import { prisma } from '../../../../prisma/prisma'

import { UserRepositoryResponse } from '@/shared'

export class PostgresGetUserByEmailRepository {
    async execute(email: string): Promise<UserRepositoryResponse | null> {
        return await prisma.user.findUnique({
            where: {
                email,
            },
        })
    }
}
