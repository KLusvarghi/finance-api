import { GetUserByIdController } from '@/controllers'
import { UserNotFoundError } from '@/errors'
import { ResponseMessage } from '@/shared'
import {
    getUserByIdHttpRequest as baseHttpRequest,
    getUserByIdServiceResponse,
    invalidIdCases,
    userId,
} from '@/test'
describe('GetUserByIdController', () => {
    let sut
    let getUserByIdService
    class GetUserByIdServiceStub {
        async execute(_userId) {
            return Promise.resolve(getUserByIdServiceResponse)
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
    beforeEach(() => {
        // Setup executado antes de cada teste
        const { sut: controller, getUserByIdService: service } = makeSut()
        sut = controller
        getUserByIdService = service
    })
    afterEach(() => {
        // Limpeza após cada teste
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })
    describe('error handling', () => {
        it('should return 404 if user is not found', async () => {
            jest.spyOn(getUserByIdService, 'execute').mockRejectedValue(
                new UserNotFoundError(userId),
            )
            const response = await sut.execute(baseHttpRequest)
            expect(response.statusCode).toBe(404)
            expect(response.body?.message).toBeTruthy()
            expect(response.body?.message).toContain(userId)
            expect(response.body?.message).toBe(
                `User with id ${userId} not found`,
            )
        })
        it('should return 500 if GetUserByIdService throws an error', async () => {
            jest.spyOn(getUserByIdService, 'execute').mockRejectedValue(
                new Error(),
            )
            const response = await sut.execute(baseHttpRequest)
            expect(response.statusCode).toBe(500)
            expect(response.body?.message).toBeTruthy()
        })
    })
    describe('validations', () => {
        describe('userId', () => {
            it('should return 400 if userId is not provided', async () => {
                const response = await sut.execute({
                    params: { userId: undefined },
                })
                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBe(
                    ResponseMessage.USER_ID_MISSING,
                )
            })
            it.each(invalidIdCases)(
                'should return 400 if userId is $description',
                async ({ id, expectedMessage }) => {
                    // arrange
                    const response = await sut.execute({
                        params: { userId: id },
                    })
                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(expectedMessage)
                },
            )
        })
    })
    describe('success cases', () => {
        it('should return 200 if user is found successfully', async () => {
            const response = await sut.execute(baseHttpRequest)
            expect(response.statusCode).toBe(200)
            expect(response.body?.message).toBeTruthy()
            expect(response.body?.data).toBeTruthy()
            expect(response.body?.data?.id).toBeTruthy()
            expect(response.body?.data?.first_name).toBeTruthy()
            expect(response.body?.data?.last_name).toBeTruthy()
            expect(response.body?.data?.email).toBeTruthy()
            expect(response.body?.data).not.toHaveProperty('password')
        })
        it('should call GetUserByIdService with correct parameters', async () => {
            // arrange
            const spy = jest.spyOn(getUserByIdService, 'execute')
            // act
            await sut.execute(baseHttpRequest)
            // assert
            expect(spy).toHaveBeenCalledWith(baseHttpRequest.params.userId)
            expect(spy).toHaveBeenCalledTimes(1)
        })
    })
})
//# sourceMappingURL=get-user-by-id.test.js.map
