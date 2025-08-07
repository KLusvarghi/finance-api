import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user'
import { UpdateUserParams, UserRepositoryResponse } from '@/shared'
import { EmailAlreadyExistsError } from '@/errors/user'

describe('UpdateUserController', () => {
    class UpdateUserServiceStub {
        async execute(
            userId: string,
            params: UpdateUserParams,
        ): Promise<UserRepositoryResponse> {
            return Promise.resolve({
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 6 }),
            })
        }
    }

    const makeSut = () => {
        const updateUserService = new UpdateUserServiceStub()
        const sut = new UpdateUserController(updateUserService)

        return {
            updateUserService,
            sut,
        }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 6,
            }),
        },
    }

    it('should return 200 when updating user successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
        // Validação completa do body de sucesso para atualização
        expect(result.body?.status).toBe('success')
        expect(result.body?.message).toBeTruthy() // Ex: "Success"
        expect(result.body?.data).toBeTruthy()

        // Validação específica dos dados atualizados retornados
        expect(result.body?.data?.first_name).toBeTruthy()
        expect(result.body?.data?.last_name).toBeTruthy()
        expect(result.body?.data?.email).toBeTruthy()
    })

    it('should return 400 when invalid email is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
        // Validação do body de erro para email inválido
        expect(result.body?.status).toBe('error')
        expect(result.body?.message).toBeTruthy()
        // Poderia ser mais específico: expect(result.body?.message).toContain('email')
    })

    it('should return 400 when invalid password is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                password: faker.internet.password({
                    length: 5,
                }),
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
        // Validação do body de erro para password muito curto
        expect(result.body?.status).toBe('error')
        expect(result.body?.message).toBeTruthy()
        // Poderia ser mais específico: expect(result.body?.message).toContain('6 characters')
    })

    it('should return 400 when invalid userId is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
            body: httpRequest.body,
        })

        // assert
        expect(result.statusCode).toBe(400)
        // Validação do body de erro para UUID inválido
        expect(result.body?.status).toBe('error')
        expect(result.body?.message).toBeTruthy()
        // Poderia ser mais específico: expect(result.body?.message).toContain('invalid')
    })

    it('should return 400 when disallowed field is provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                disallowed_field: 'disallowed_field',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
        // Validação do body de erro para campo não permitido
        expect(result.body?.status).toBe('error')
        expect(result.body?.message).toBeTruthy()
        // Poderia ser mais específico: expect(result.body?.message).toContain('not allowed')
    })

    // testando um erro generico
    it('should return 500 when UpdateUserService throws generic error', async () => {
        // arrange
        const { sut, updateUserService } = makeSut()
        jest.spyOn(updateUserService, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
        // Validação do body de erro para erros internos do servidor
        expect(result.body?.status).toBe('error')
        expect(result.body?.message).toBeTruthy()
        // Mensagem padrão seria: "Internal server error"
    })

    // simulando um erro de email já existente
    it('should return 400 when UpdateUserService throws EmailAlreadyExistsError', async () => {
        // arrange
        const { sut, updateUserService } = makeSut()
        const duplicateEmail = faker.internet.email()
        jest.spyOn(updateUserService, 'execute').mockRejectedValueOnce(
            new EmailAlreadyExistsError(duplicateEmail),
        )

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
        // Validação específica do body de erro para email já existente
        expect(result.body?.status).toBe('error')
        expect(result.body?.message).toBeTruthy()
        // A mensagem deveria conter o email que já está em uso
        expect(result.body?.message).toContain(duplicateEmail)
        expect(result.body?.message).toContain('already in use')
    })
})
