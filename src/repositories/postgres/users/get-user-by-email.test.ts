import { createUserRepositoryResponse as fakeUser } from '@/test'
import { prisma } from '../../../../prisma/prisma'
import { PostgresGetUserByEmailRepository } from './get-user-by-email'

describe('PostgresGetUserByEmailRepository', () => {
    let sut = new PostgresGetUserByEmailRepository()

    describe('error handling', () => {
        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute(fakeUser.email)

            expect(promise).rejects.toThrow(new Error('Prisma error'))
        })
    })
    describe('success', () => {
        it('should get user by email on database successfully', async () => {
            const user = await prisma.user.create({
                data: fakeUser,
            })

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
    })
})
