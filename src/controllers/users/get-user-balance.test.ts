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

    it('should return 200 when user getting balance', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 404 when userId is invalid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({ params: { userId: 'invalid_id' } })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if GetUserBalanceService throws', async () => {
        // arrange
        const { sut, getUserBalanceService } = makeSut()
        
        // quando eu rejeito uma promisse, ele automaticamente está rejeitando, por isso não preciso instanciar o error e passar dentro de uma arrow function
        jest.spyOn(getUserBalanceService, 'execute').mockRejectedValueOnce
        (new Error())


        // ambos acabam executando a mesma coisa, porém, usando o "mockImplementationOnce" é preciso instanciar o error e ser passado dentro de uma arrow function

        // jest.spyOn(getUserBalanceService, 'execute').mockImplementationOnce(
        //     () => {
        //         throw new Error()
        //     },
        // )

        // o código abaixo é o mesmo que o de cima, porém, é mais simples e direto
        // ()=> Promise.reject(new Error()) 


        // act
    

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })
})
