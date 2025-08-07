import { GetUserBalanceParams, UserBalanceRepositoryResponse } from '@/shared'
import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance'
import { Prisma } from '@prisma/client'

describe('GetUserBalanceController', () => {
    let sut: GetUserBalanceController
    let getUserBalanceService: GetUserBalanceServiceStub
    let validUserId: string

    class GetUserBalanceServiceStub {
        execute(_params: GetUserBalanceParams): Promise<UserBalanceRepositoryResponse> {
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

    beforeEach(() => {
        // Setup executado antes de cada teste
        const { sut: controller, getUserBalanceService: service } = makeSut()
        sut = controller
        getUserBalanceService = service

        // Dados válidos sempre disponíveis
        validUserId = faker.string.uuid()
    })

    afterEach(() => {
        // Limpeza após cada teste
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('validations', () => {
        describe('userId', () => {
            it('should return 400 when userId is invalid', async () => {
                const result = await sut.execute({
                    params: { userId: 'invalid_id' },
                })

                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBeTruthy()
            })
        })
    })

    describe('success cases', () => {
        it('should return 200 when getting user balance successfully', async () => {
            const result = await sut.execute({
                params: { userId: validUserId },
            })

            expect(result.statusCode).toBe(200)
            expect(result.body?.status).toBe('success')
            expect(result.body?.message).toBeTruthy()
            expect(result.body?.data).toBeTruthy()
            expect(result.body?.data?.earnings).toBeDefined()
            expect(result.body?.data?.expenses).toBeDefined()
            expect(result.body?.data?.investments).toBeDefined()
            expect(result.body?.data?.balance).toBeDefined()
            expect(typeof result.body?.data?.earnings).toBe('number')
            expect(typeof result.body?.data?.expenses).toBe('number')
            expect(typeof result.body?.data?.investments).toBe('number')
        })
    })

    describe('error handling', () => {
        it('should return 500 if GetUserBalanceService throws', async () => {
            jest.spyOn(getUserBalanceService, 'execute').mockRejectedValueOnce(
                new Error(),
            )

            const result = await sut.execute({
                params: { userId: validUserId },
            })

            expect(result.statusCode).toBe(500)
            expect(result.body?.status).toBe('error')
            expect(result.body?.message).toBeTruthy()
        })
    })
})
