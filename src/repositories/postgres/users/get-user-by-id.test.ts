import { createUserRepositoryResponse as fakeUser } from '@/test'
import { prisma } from '../../../../prisma/prisma'
import { PostgresGetUserByIdRepository } from './get-user-by-id'

describe('PostgresGetUserByIdRepository', () => {
    let sut = new PostgresGetUserByIdRepository()

    describe('success', () => {
        it('should get user by id on database successfully', async () => {
            const user = await prisma.user.create({
                data: fakeUser,
            })

            const response = await sut.execute(fakeUser.id)

            expect(response).toStrictEqual(user)
        })
    })
})
