import { UserRepositoryResponse } from '@/shared/types'
import { prisma } from '../../../../prisma/prisma'

export class PostgresGetUserByEmailRepository {
    async execute(email: string): Promise<UserRepositoryResponse | null> {
        return await prisma.user.findUnique({
            where: {
                email,
            },
        })
    }
}
