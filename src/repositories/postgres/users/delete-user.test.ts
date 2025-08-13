import { createUserRepositoryResponse } from '@/test'
import { PostgresDeleteUserRepository } from './delete-user'
import { prisma } from '../../../../prisma/prisma'

describe('DeleteUserRepository', () => {
    let sut = new PostgresDeleteUserRepository()

    describe('success', () => {
        it('should delete a user on database successfully', async () => {
            // precisamos criar um usuário antes de querer deletar
            await prisma.user.create({
                data: createUserRepositoryResponse,
            })

            const response = await sut.execute(createUserRepositoryResponse.id)

            expect(response).toStrictEqual(createUserRepositoryResponse)
        })
    })

    describe('validations', () => {
        // it('should call Prisma with correct params', async () => {
        //     const prismaSpy = jest.spyOn(prisma.user, 'create')

        //     await sut.execute(createUserRepositoryResponse)

        //     expect(prismaSpy).toHaveBeenCalledWith({
        //         data: createUserRepositoryResponse,
        //     })
        // })
    })
})
