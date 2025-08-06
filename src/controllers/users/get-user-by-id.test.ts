import { HttpResponse, UserRepositoryResponse } from '@/shared'
import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id'
import { UserNotFoundError } from '@/errors/user'

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
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 if user is found successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 404 if userId is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({ params: { userId: '' } })

        // assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 400 if userId is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({ params: { userId: 'invalid_id' } })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if user is not found', async () => {
        // arrange
        const { sut, getUserByIdService } = makeSut()

        // simulando que o service lance um UserNotFoundError quando não encontra o usuário
        jest.spyOn(getUserByIdService, 'execute').mockRejectedValue(
            new UserNotFoundError(httpRequest.params.userId),
        )
        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if GetUserByIdService throws an error', async () => {
        // arrange
        const { sut, getUserByIdService } = makeSut()
        // precisamos mockar o retorno de execute de forma que seja rejeitada
        jest.spyOn(getUserByIdService, 'execute').mockRejectedValue(new Error())

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })
})
