import { prisma } from '../../../../prisma/prisma'

import { PostgresGetUserByIdRepository } from '@/repositories/postgres'
import {
    createTestUser,
    createUserRepositoryResponse as fakeUser,
} from '@/test'

describe('PostgresGetUserByIdRepository', () => {
    const sut = new PostgresGetUserByIdRepository()

    describe('error handling', () => {
        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute(fakeUser.id)

            expect(promise).rejects.toThrow(new Error('Prisma error'))
        })
    })

    describe('success', () => {
        it('should get user by id on database successfully', async () => {
            const user = await createTestUser()

            const response = await sut.execute(fakeUser.id)

            expect(response).toStrictEqual(user)
        })
    })
    describe('validations', () => {
        it('should call Prisma with correct params', async () => {
            // arrange
            // monitoramos o metodo "findUnique" do prisma
            const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

            // act
            await sut.execute(fakeUser.id)

            // assert
            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    id: fakeUser.id,
                },
            })
        })

        it('should return null if user does not exist', async () => {
            // arrange
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null)

            // act
            const response = await sut.execute(fakeUser.id)

            // assert
            expect(response).toBeNull()
        })
    })
})
