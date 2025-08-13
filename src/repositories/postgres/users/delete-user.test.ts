import { createUserRepositoryResponse, userId } from '@/test'
import { PostgresDeleteUserRepository } from './delete-user'
import { prisma } from '../../../../prisma/prisma'

describe('PostgresDeleteUserRepository', () => {
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
        it('should call Prisma with correct params', async () => {
            // Criar um usuário antes de testar a validação
            await prisma.user.create({
                data: createUserRepositoryResponse,
            })

            const prismaSpy = jest.spyOn(prisma.user, 'delete')

            await sut.execute(createUserRepositoryResponse.id)

            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    id: createUserRepositoryResponse.id,
                },
            })
        })

        it('should return null if user does not exist', async () => {
            // como não tem usuário no banco, ele retorna null
            const response = await sut.execute(userId)

            expect(response).toBeNull()
        })
    })
})
