import { HttpResponse, UserRepositoryResponse } from '@/shared'
import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id'

describe('GetUserByIdController', () => {
    class GetUserByIdServiceStub {
        async execute(): Promise<UserRepositoryResponse> {
            return Promise.resolve({
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            })
        }
    }

    const makeSut = () => {
        const getUserByIdService = new GetUserByIdServiceStub()
        const sut = new GetUserByIdController(getUserByIdService)

        return {
            getUserByIdService,
            sut,
        }
    }

    const httpRequest = {
      params: {
        userId: faker.string.uuid()
      }
    }

    it('should return 200 if user is found', async () => {
        // arrange
        const {sut} = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 404 if userId is not provided', async () => {
       // arrange
       const {sut} = makeSut()

       // act
       const result = await sut.execute({params: {userId: ''}})

       // assert
       expect(result.statusCode).toBe(404)
    })

    it('should return 400 if userId is invalid', async () => {
      // arrange
      const {sut} = makeSut()

      // act
      const result = await sut.execute({params: {userId: 'invaid_id'}})

      // assert
      expect(result.statusCode).toBe(400)
   })

   it('should return 400 if userId is invalid', async () => {
    // arrange
    const {sut} = makeSut()

    // act
    const result = await sut.execute({params: {userId: 'invaid_id'}})

    // assert
    expect(result.statusCode).toBe(400)
 })
})
