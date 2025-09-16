import { prisma } from '../../../prisma/prisma'

import { PasswordHasherAdapter, TokensGeneratorAdapter } from '@/adapters'
import { UserWithTokensResponse } from '@/shared'
import { fakerPT_BR as faker } from '@faker-js/faker'

export const makeUser = async (
    password?: string,
): Promise<UserWithTokensResponse> => {
    const hashPassword = await new PasswordHasherAdapter().execute(
        password || faker.internet.password(),
    )
    const user = await prisma.user.create({
        data: {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            password: hashPassword,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        },
    })

    const userWithoutPassword = {
        ...user,
        password: undefined,
    }

    const tokens = await new TokensGeneratorAdapter().execute(user.id)

    return {
        ...userWithoutPassword,
        tokens,
    }
}
