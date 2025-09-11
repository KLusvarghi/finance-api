import { GetUserByIdController } from '@/controllers'
import { UserNotFoundError } from '@/errors'
import { HttpResponseSuccessBody, UserPublicResponse } from '@/shared'
import {
    getUserByIdHttpRequest as baseHttpRequest,
    getUserByIdServiceResponse,
    userId,
} from '@/test'

describe('GetUserByIdController', () => {
    let sut: GetUserByIdController
    let getUserByIdService: GetUserByIdServiceStub

    class GetUserByIdServiceStub {
        async execute(_userId: string): Promise<UserPublicResponse> {
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
        it('should throw UserNotFoundError when user is not found', async () => {
            const userNotFoundError = new UserNotFoundError(userId)
            jest.spyOn(getUserByIdService, 'execute').mockRejectedValue(
                userNotFoundError,
            )

            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                UserNotFoundError,
            )
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                `User with id ${userId} not found`,
            )
        })

        it('should throw generic error when GetUserByIdService throws an error', async () => {
            const genericError = new Error('Service error')
            jest.spyOn(getUserByIdService, 'execute').mockRejectedValue(
                genericError,
            )

            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                genericError,
            )
        })
    })

    describe('success cases', () => {
        it('should return 200 if user is found successfully', async () => {
            const response = await sut.execute({
                headers: { userId },
            })

            expect(response.statusCode).toBe(200)
            expect(response.body?.success).toBe(true)
            expect(response.body?.message).toBeTruthy()
            expect(
                (response.body as HttpResponseSuccessBody)?.data,
            ).toBeTruthy()
            expect(
                (response.body as HttpResponseSuccessBody<UserPublicResponse>)
                    ?.data?.id,
            ).toBeTruthy()
            expect(
                (response.body as HttpResponseSuccessBody<UserPublicResponse>)
                    ?.data?.firstName,
            ).toBeTruthy()
            expect(
                (response.body as HttpResponseSuccessBody<UserPublicResponse>)
                    ?.data?.lastName,
            ).toBeTruthy()
            expect(
                (response.body as HttpResponseSuccessBody<UserPublicResponse>)
                    ?.data?.email,
            ).toBeTruthy()
            expect(
                (response.body as HttpResponseSuccessBody)?.data,
            ).not.toHaveProperty('password')
        })

        it('should call GetUserByIdService with correct parameters', async () => {
            // arrange
            const spy = jest.spyOn(getUserByIdService, 'execute')

            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(spy).toHaveBeenCalledWith(baseHttpRequest.headers.userId)
            expect(spy).toHaveBeenCalledTimes(1)
        })
    })
})
