import { DeleteUserController } from './delete-user'
import { faker } from '@faker-js/faker'

describe('DeleteUserController', () => {
    class DeleteUserServiceStub {
        execute(userId: string) {
            return Promise.resolve({
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            })
        }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
            
        },
    }

    const makeSut = () => {
        const deleteUserService = new DeleteUserServiceStub()
        const sut = new DeleteUserController(deleteUserService)

        return { deleteUserService, sut }
    }

    it('should return 200 if user is deleted', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if userId is invalid', async () => {
      // arrange
      const { sut } = makeSut()

      // act
      const result = await sut.execute({params: {userId: 'invalid-uuid'}})

      // assert
      expect(result.statusCode).toBe(400)
  })
})
