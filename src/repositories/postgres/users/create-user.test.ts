import { createUserRepositoryResponse } from '@/test'
import { PostgresCreateUserRepository } from './create-user'
import { prisma } from '../../../../prisma/prisma'

describe('CreateUserRepository', () => {
    let sut = new PostgresCreateUserRepository()

    describe('success', () => {
        it('should create a user on database', async () => {
            const response = await sut.execute(createUserRepositoryResponse)

            expect(response).not.toBeNull()
            expect(response).toEqual(createUserRepositoryResponse)
        })
    })

    describe('validations', () => {
      it('should call Prisma with correct params', async () => {
        const prismaSpy = jest.spyOn(prisma.user, 'create')

        await sut.execute(createUserRepositoryResponse)

        expect(prismaSpy).toHaveBeenCalledWith({
          data: createUserRepositoryResponse,
        })
      })
    })
})
