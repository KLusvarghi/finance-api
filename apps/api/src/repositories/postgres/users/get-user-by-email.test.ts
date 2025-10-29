import { PostgresGetUserByEmailRepository } from '@/repositories/postgres'
import {
    createTestUser,
    createUserRepositoryResponse as fakeUser,
} from '@/test'

import { prisma } from '../../../../prisma/prisma'

describe('PostgresGetUserByEmailRepository', () => {
    const sut = new PostgresGetUserByEmailRepository()

    describe('error handling', () => {
        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute(fakeUser.email)

            await expect(promise).rejects.toThrow(new Error('Prisma error'))
        })
    })
    describe('success', () => {
        it('should get user by email on database successfully', async () => {
            const user = await createTestUser()

            const response = await sut.execute(fakeUser.email)

            expect(response).toStrictEqual(user)
        })
    })

    describe('validations', () => {
        it('should call Prisma with correct params', async () => {
            // arrange
            // monitoramos o metodo "findUnique" do prisma
            const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

            // act
            await sut.execute(fakeUser.email)

            // assert
            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    email: fakeUser.email,
                },
            })
        })

        it('should return null if user does not exist', async () => {
            // arrange
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null)

            // act
            const response = await sut.execute(fakeUser.email)

            // assert
            expect(response).toBeNull()
        })
    })
})
