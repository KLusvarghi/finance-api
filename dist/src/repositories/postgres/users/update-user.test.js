import { prisma } from '../../../../prisma/prisma'
import { UserNotFoundError } from '@/errors'
import { PostgresUpdateUserRepository } from '@/repositories/postgres'
import {
    createTestUser,
    updateUserParams as params,
    updateUserRepositoryResponse as fakeUser,
    userId,
} from '@/test'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
describe('PostgresUpdateUserRepository', () => {
    const sut = new PostgresUpdateUserRepository()
    const updateUserParams = {
        ...params,
        password: 'valid_hash',
    }
    describe('error handling', () => {
        it('should throw error intance of PrismaClientKnownRequestError if user is not found', async () => {
            jest.spyOn(prisma.user, 'update').mockImplementationOnce(() => {
                throw new PrismaClientKnownRequestError('User not found', {
                    code: 'P2025',
                    clientVersion: '0.0.0',
                })
            })
            const promise = sut.execute(userId, updateUserParams)
            expect(promise).rejects.toBeInstanceOf(UserNotFoundError)
        })
        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute(fakeUser.id, updateUserParams)
            expect(promise).rejects.toThrow(new Error('Prisma error'))
        })
    })
    describe('success', () => {
        it('should update user on database successfully', async () => {
            // arrange
            const user = await createTestUser()
            // act
            // tendo que fazer isso pois o password chega ao repository criptografado, e o nosso "updateUserParams" vem com a senha descriptografada
            const response = await sut.execute(user.id, updateUserParams)
            // assert
            expect(response).toStrictEqual(fakeUser)
        })
    })
    describe('validations', () => {
        it('should call Prisma with correct params', async () => {
            // arrange
            const user = await prisma.user.create({
                data: fakeUser,
            })
            // monitoramos o metodo "update" do prisma
            const prismaSpy = jest.spyOn(prisma.user, 'update')
            // act
            await sut.execute(user.id, updateUserParams)
            // assert
            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    id: user.id,
                },
                data: updateUserParams,
            })
        })
    })
})
//# sourceMappingURL=update-user.test.js.map
