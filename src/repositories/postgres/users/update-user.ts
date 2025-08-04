import { UpdateUserParams, UserRepositoryResponse } from '@/shared/types'
import { prisma } from '../../../../prisma/prisma'

export class PostgresUpdateUserRepository {
    async execute(
        userId: string,
        updateParams: UpdateUserParams,
    ): Promise<UserRepositoryResponse | null> {
        return await prisma.user.update({
            where: {
                id: userId,
            },
            data: updateParams,
        })
    }
}
