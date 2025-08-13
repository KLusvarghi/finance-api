import { createUserRepositoryResponse as fakeUser } from '@/test'
import { prisma } from '../../../../prisma/prisma'
import { PostgresGetUserByEmailRepository } from './get-user-by-email'

describe('PostgresGetUserByEmailRepository', () => {
    let sut = new PostgresGetUserByEmailRepository()

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
