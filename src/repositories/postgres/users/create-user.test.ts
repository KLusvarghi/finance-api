import { createUserRepositoryResponse as user } from '@/test'
import { PostgresCreateUserRepository } from './create-user'
import { prisma } from '../../../../prisma/prisma'

describe('PostgresCreateUserRepository', () => {
    let sut = new PostgresCreateUserRepository()

    describe('success', () => {
        it('should create a user on database', async () => {
            const response = await sut.execute(user)

            expect(response).not.toBeNull()
            expect(response).toStrictEqual(user)
        })
    })

    describe('validations', () => {
      it('should call Prisma with correct params', async () => {
        const prismaSpy = jest.spyOn(prisma.user, 'create')

        await sut.execute(user)

        expect(prismaSpy).toHaveBeenCalledWith({
          data: user,
        })
      })
    })
})
