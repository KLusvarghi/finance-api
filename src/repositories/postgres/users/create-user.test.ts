import {
    updateUserParams,
    createUserRepositoryResponse as fakerUser,
} from '@/test'
import { PostgresCreateUserRepository } from './create-user'
import { prisma } from '../../../../prisma/prisma'

describe('PostgresCreateUserRepository', () => {
    let sut = new PostgresCreateUserRepository()

    describe('error handling', () => {
        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.user, 'create').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute(fakerUser)

            expect(promise).rejects.toThrow(new Error('Prisma error'))
        })
    })

    describe('success', () => {
        it('should create a user on database', async () => {
            const response = await sut.execute(fakerUser)

            expect(response).not.toBeNull()
            expect(response).toStrictEqual(fakerUser)
        })
    })

    describe('validations', () => {
        it('should call Prisma with correct params', async () => {
            const prismaSpy = jest.spyOn(prisma.user, 'create')

            await sut.execute(fakerUser)

            expect(prismaSpy).toHaveBeenCalledWith({
                data: fakerUser,
            })
        })
    })
})
