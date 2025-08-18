import { prisma } from '../../../../prisma/prisma'

import { UserNotFoundError } from '@/errors'
import { PostgresDeleteUserRepository } from '@/repositories/postgres'
import {
    createTestUser,
    createUserRepositoryResponse as fakeUser,
    userId,
} from '@/test'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

describe('PostgresDeleteUserRepository', () => {
    const sut = new PostgresDeleteUserRepository()

    describe('error handling', () => {
        it('should throw UserNotFoundError if user is not found', async () => {
            jest.spyOn(prisma.user, 'delete').mockImplementationOnce(() => {
                throw new PrismaClientKnownRequestError('User not found', {
                    code: 'P2025',
                    clientVersion: '0.0.0',
                })
            })

            const promise = sut.execute(userId)

            expect(promise).rejects.toBeInstanceOf(UserNotFoundError)
        })

        it('should throw an error if Prisma throws', async () => {
            jest.spyOn(prisma.user, 'delete').mockImplementationOnce(() => {
                throw new Error('Prisma error')
            })

            const promise = sut.execute(userId)

            await expect(promise).rejects.toThrow('Prisma error')
        })
    })

    describe('success', () => {
        it('should delete a user on database successfully', async () => {
            // precisamos criar um usuário antes de querer deletar
            await createTestUser()

            const response = await sut.execute(fakeUser.id)

            expect(response).toStrictEqual(fakeUser)
        })
    })

    describe('validations', () => {
        it('should call Prisma with correct params', async () => {
            // Criar um usuário antes de testar a validação
            await createTestUser()

            const prismaSpy = jest.spyOn(prisma.user, 'delete')

            await sut.execute(fakeUser.id)

            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    id: fakeUser.id,
                },
            })
        })
    })
})
