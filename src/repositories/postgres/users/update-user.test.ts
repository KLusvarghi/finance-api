import {
    updateUserRepositoryResponse as fakeUser,
    updateUserParams,
} from '@/test'
import { prisma } from '../../../../prisma/prisma'
import { PostgresUpdateUserRepository } from './update-user'

describe('PostgresUpdateUserRepository', () => {
    let sut = new PostgresUpdateUserRepository()

    describe('success', () => {
        it('should update user on database successfully', async () => {
            // arrange
            const user = await prisma.user.create({
                data: fakeUser,
            })
            // act
            // tendo que fazer isso pois o password chega ao repository criptografado, e o nosso "updateUserParams" vem com a senha descriptografada
            const response = await sut.execute(user.id, {
                ...updateUserParams,
                password: 'valid_hash',
            })

            // assert
            expect(response).toStrictEqual(fakeUser)
        })
    })

    // describe('validations', () => {
    //   it('should call Prisma with correct params', async () => {
    //       // arrange
    //       // monitoramos o metodo "findUnique" do prisma
    //       const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

    //       // act
    //       await sut.execute(fakeUser.email)

    //       // assert
    //       expect(prismaSpy).toHaveBeenCalledWith({
    //         where: {
    //             email: fakeUser.email,
    //         },
    //       })
    //     })
    // })
})
