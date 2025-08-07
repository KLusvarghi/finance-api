import {
    HttpResponse,
    UserPublicResponse,
    UserRepositoryResponse,
} from '@/shared'
import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id'
import { UserNotFoundError } from '@/errors/user'

describe('GetUserByIdController', () => {
    class GetUserByIdServiceStub {
        async execute(): Promise<UserPublicResponse> {
            return Promise.resolve({
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
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
        // Validação completa do body de sucesso
        expect(result.body?.status).toBe('success')
        expect(result.body?.message).toBeTruthy() // Ex: "Success"
        expect(result.body?.data).toBeTruthy()

        // Validação específica dos dados do usuário retornados
        expect(result.body?.data?.id).toBeTruthy()
        expect(result.body?.data?.first_name).toBeTruthy()
        expect(result.body?.data?.last_name).toBeTruthy()
        expect(result.body?.data?.email).toBeTruthy()
        // Importante: password NÃO deve ser retornado por segurança
        expect(result.body?.data).not.toHaveProperty('password')
    })

    it('should return 404 if userId is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({ params: { userId: '' } })

        // assert
        expect(result.statusCode).toBe(404)
        // Validação do body de erro para userId vazio
        expect(result.body?.status).toBe('error')
        expect(result.body?.message).toBeTruthy()
        // Poderia ser mais específico: expect(result.body?.message).toContain('required')
    })

    it('should return 400 if userId is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({ params: { userId: 'invalid_id' } })

        // assert
        expect(result.statusCode).toBe(400)
        // Validação do body de erro para UUID inválido
        expect(result.body?.status).toBe('error')
        expect(result.body?.message).toBeTruthy()
        // Poderia ser mais específico: expect(result.body?.message).toContain('invalid')
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
        // Validação do body de erro específico para usuário não encontrado
        expect(result.body?.status).toBe('error')
        expect(result.body?.message).toBeTruthy()
        // A mensagem deveria conter o ID do usuário que não foi encontrado
        expect(result.body?.message).toContain(httpRequest.params.userId)
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
        // Validação do body de erro para erros internos do servidor
        expect(result.body?.status).toBe('error')
        expect(result.body?.message).toBeTruthy()
        // Mensagem padrão seria: "Internal server error"
    })
})
