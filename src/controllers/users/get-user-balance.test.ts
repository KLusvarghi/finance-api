import {
    // GetUserBalanceParams,
    GetUserBalanceService,
    UserBalanceRepositoryResponse,
} from '@/shared'
import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance'
import { Prisma } from '@prisma/client'

describe('GetUserBalanceController', () => {
    class GetUserBalanceServiceStub implements GetUserBalanceService {
        execute(
            // params: GetUserBalanceParams,
        ): Promise<UserBalanceRepositoryResponse> {
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
})
