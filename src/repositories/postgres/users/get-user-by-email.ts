import { prisma } from '../../../../prisma/prisma'

import { GetUserByEmailRepository, UserRepositoryResponse } from '@/shared'

export class PostgresGetUserByEmailRepository
    implements GetUserByEmailRepository
{
    async execute(email: string): Promise<UserRepositoryResponse | null> {
        return await prisma.user.findUnique({
            where: {
                email,
            },
        })
    }
}

// Alias para manter compatibilidade com as importações
export { PostgresGetUserByEmailRepository as GetUserByEmailRepository }
