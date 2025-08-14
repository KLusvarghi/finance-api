import { HttpRequest, UserBalanceRepositoryResponse } from '@/shared'
import { GetUserBalanceController } from './get-user-balance'
import { UserNotFoundError } from '@/errors/user'
import {
    userId,
    userBalanceResponse,
    getUserBalanceBaseHttpRequest as baseHttpRequest,
    invalidUUID,
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

            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(500)
            expect(result.body?.status).toBe('error')
            expect(result.body?.message).toBeTruthy()
        })

        it('should return 404 if GetUserBalanceService throws UserNotFoundError', async () => {
            jest.spyOn(getUserBalanceService, 'execute').mockRejectedValueOnce(
                new UserNotFoundError(userId),
            )

            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(404)
            expect(result.body?.status).toBe('error')
            expect(result.body?.message).toBeTruthy()
            expect(result.body?.message).toContain(userId)
        })
    })

    describe('validations', () => {
        describe('userId', () => {
            it('should return 400 if userId is not provided', async () => {
                const result = await sut.execute({
                    params: { userId: undefined },
                })

                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBe('Missing param: userId')
            })

            it.each(invalidUUID)(
                'should return 400 if userId is $description',
                async ({ id }) => {
                    // arrange
                    const result = await sut.execute({
                        params: { userId: id },
                    })

                    // assert
                    expect(result.statusCode).toBe(400)
                    expect(result.body?.status).toBe('error')
                    expect(result.body?.message).toBe(
                        'The provider id is not valid.',
                    )
                },
            )
        })
    })

    describe('success cases', () => {
        it('should return 200 when getting user balance successfully', async () => {
            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(200)
            expect(result.body?.status).toBe('success')
            expect(result.body?.message).toBeTruthy()
            expect(result.body?.data).toEqual(userBalanceResponse)
            expect(result.body?.data?.earnings).toBeDefined()
            expect(result.body?.data?.expenses).toBeDefined()
            expect(result.body?.data?.investments).toBeDefined()
            expect(result.body?.data?.balance).toBeDefined()
            expect(typeof result.body?.data?.earnings).toBe('number')
            expect(typeof result.body?.data?.expenses).toBe('number')
            expect(typeof result.body?.data?.investments).toBe('number')
        })

        it('should call GetUserBalanceService with correct parameters', async () => {
            // arrange
            const spy = jest.spyOn(getUserBalanceService, 'execute')

            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(spy).toHaveBeenCalledWith(baseHttpRequest.params.userId)
            expect(spy).toHaveBeenCalledTimes(1)
        })
    })
})
