import { PostgresCreateUserRepository } from '@/repositories/postgres'
import { createUserRepositoryResponse as fakeUser } from '@/test'

import { prisma } from '../../../../prisma/prisma'

describe('PostgresCreateUserRepository', () => {
    const sut = new PostgresCreateUserRepository()

    describe('error handling', () => {
        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.user, 'create').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute(fakeUser)

            await expect(promise).rejects.toThrow(new Error('Prisma error'))
        })
    })

    describe('success', () => {
        it('should create a user on database', async () => {
            const response = await sut.execute(fakeUser)

            expect(response).not.toBeNull()
            expect(response).toStrictEqual(fakeUser)
        })
    })

    describe('validations', () => {
        it('should call Prisma with correct params', async () => {
            const prismaSpy = jest.spyOn(prisma.user, 'create')

            await sut.execute(fakeUser)

            expect(prismaSpy).toHaveBeenCalledWith({
                data: fakeUser,
            })
        })
    })
})
