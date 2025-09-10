import { prisma } from '../../../prisma/prisma'

import { TokensGeneratorAdapter } from '@/adapters'
import { TokensGeneratorAdapterResponse, UserPublicResponse } from '@/shared'
import { faker } from '@faker-js/faker'

export const makeUser = async (): Promise<
    UserPublicResponse & { tokens: TokensGeneratorAdapterResponse }
> => {
    const user = await prisma.user.create({
        data: {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            password: faker.internet.password(),
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
