import {
    createTestUser,
    updateUserRepositoryResponse as fakeUser,
    updateUserParams as params,
} from '@/test'
import { prisma } from '../../../../prisma/prisma'
import { PostgresUpdateUserRepository } from './update-user'

describe('PostgresUpdateUserRepository', () => {
    let sut = new PostgresUpdateUserRepository()
    let updateUserParams = {
        ...params,
        password: 'valid_hash',
    }

    describe('error handling', () => {
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
