import { GetUserBalanceController } from '@/controllers'
import { UserNotFoundError } from '@/errors'
import { UserBalanceRepositoryResponse } from '@/shared'
import {
    getUserBalanceHttpRequest as baseHttpRequest,
    userBalanceResponse,
    userId,
} from '@/test'

describe('GetUserBalanceController', () => {
    let sut: GetUserBalanceController
    let getUserBalanceService: GetUserBalanceServiceStub

    class GetUserBalanceServiceStub {
        execute(_userId: string): Promise<UserBalanceRepositoryResponse> {
            return Promise.resolve(userBalanceResponse)
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
    })

    afterEach(() => {
        // Limpeza após cada teste
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('error handling', () => {
        it('should return 500 if GetUserBalanceService throws', async () => {
            jest.spyOn(getUserBalanceService, 'execute').mockRejectedValueOnce(
                new Error(),
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(500)
            expect(response.body?.message).toBeTruthy()
        })

        it('should return 404 if GetUserBalanceService throws UserNotFoundError', async () => {
            jest.spyOn(getUserBalanceService, 'execute').mockRejectedValueOnce(
                new UserNotFoundError(userId),
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(404)
            expect(response.body?.message).toBeTruthy()
            expect(response.body?.message).toContain(userId)
        })
    })

    describe('success cases', () => {
        it('should return 200 when getting user balance successfully', async () => {
            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(200)
            expect(response.body?.message).toBeTruthy()
            expect(response.body?.data).toEqual(userBalanceResponse)
            expect(response.body?.data?.earnings).toBeDefined()
            expect(response.body?.data?.expenses).toBeDefined()
            expect(response.body?.data?.investments).toBeDefined()
            expect(response.body?.data?.balance).toBeDefined()
            expect(typeof response.body?.data?.earnings).toBe('string')
            expect(typeof response.body?.data?.expenses).toBe('string')
            expect(typeof response.body?.data?.investments).toBe('string')
            expect(typeof response.body?.data?.balance).toBe('string')
        })

        it('should call GetUserBalanceService with correct parameters', async () => {
            // arrange
            const spy = jest.spyOn(getUserBalanceService, 'execute')

            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(spy).toHaveBeenCalledWith(
                baseHttpRequest.headers.userId,
                baseHttpRequest.query.from,
                baseHttpRequest.query.to,
            )
            expect(spy).toHaveBeenCalledTimes(1)
        })
    })
})
