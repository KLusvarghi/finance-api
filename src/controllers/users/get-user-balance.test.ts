import {
    // GetUserBalanceParams,
    GetUserBalanceService,
    UserBalanceRepositoryResponse,
} from '@/shared'
import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance'
import { Prisma } from '@prisma/client'

describe('GetUserBalanceController', () => {
    class GetUserBalanceServiceStub {
        execute() // params: GetUserBalanceParams,
        : Promise<UserBalanceRepositoryResponse> {
            return Promise.resolve({
                earnings: faker.number.float(),
                expenses: faker.number.float(),
                investments: faker.number.float(),
                balance: new Prisma.Decimal(faker.number.float()),
            })
        }
    }

    const makeSut = () => {
        const getUserBalanceService = new GetUserBalanceServiceStub()
        const sut = new GetUserBalanceController(getUserBalanceService)

        return { getUserBalanceService, sut }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    describe('validations', () => {
        describe('userId', () => {
            it('should return 400 when userId is invalid', async () => {
                // arrange
                const { sut } = makeSut()

                // act
                const result = await sut.execute({
                    params: { userId: 'invalid_id' },
                })

                // assert
                expect(result.statusCode).toBe(400)
                // Validação do body de erro para UUID inválido
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBeTruthy()
                // Poderia ser mais específico: expect(result.body?.message).toContain('invalid')
            })
        })
    })

    describe('success cases', () => {
        it('should return 200 when getting user balance successfully', async () => {
            // arrange
            const { sut } = makeSut()

            // act
            const result = await sut.execute(httpRequest)

            // assert
            expect(result.statusCode).toBe(200)
            // Validação completa do body de sucesso para saldo do usuário
            expect(result.body?.status).toBe('success')
            expect(result.body?.message).toBeTruthy() // Ex: "Success"
            expect(result.body?.data).toBeTruthy()

            // Validação específica dos dados de saldo
            expect(result.body?.data?.earnings).toBeDefined()
            expect(result.body?.data?.expenses).toBeDefined()
            expect(result.body?.data?.investments).toBeDefined()
            expect(result.body?.data?.balance).toBeDefined()
            // Todos devem ser números (ou Decimal)
            expect(typeof result.body?.data?.earnings).toBe('number')
            expect(typeof result.body?.data?.expenses).toBe('number')
            expect(typeof result.body?.data?.investments).toBe('number')
        })
    })

    describe('error handling', () => {
        it('should return 500 if GetUserBalanceService throws', async () => {
            // arrange
            const { sut, getUserBalanceService } = makeSut()

            // quando eu rejeito uma promisse, ele automaticamente está rejeitando, por isso não preciso instanciar o error e passar dentro de uma arrow function
            jest.spyOn(getUserBalanceService, 'execute').mockRejectedValueOnce(
                new Error(),
            )

            // ambos acabam executando a mesma coisa, porém, usando o "mockImplementationOnce" é preciso instanciar o error e ser passado dentro de uma arrow function

            // jest.spyOn(getUserBalanceService, 'execute').mockImplementationOnce(
            //     () => {
            //         throw new Error()
            //     },
            // )

            // o código abaixo é o mesmo que o de cima, porém, é mais simples e direto
            // ()=> Promise.reject(new Error())

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
})
