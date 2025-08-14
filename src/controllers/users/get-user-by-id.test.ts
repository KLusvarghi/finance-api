import { UserPublicResponse } from '@/shared'
import { GetUserByIdController } from './get-user-by-id'
import { UserNotFoundError } from '@/errors/user'
import {
    userId,
    getUserByIdServiceResponse,
    getUserByIdBaseHttpRequest as baseHttpRequest,
    invalidUUID,
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
        it('should return 404 if user is not found', async () => {
            jest.spyOn(getUserByIdService, 'execute').mockRejectedValue(
                new UserNotFoundError(userId),
            )

            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(404)
            expect(result.body?.status).toBe('error')
            expect(result.body?.message).toBeTruthy()
            expect(result.body?.message).toContain(userId)
        })

        it('should return 500 if GetUserByIdService throws an error', async () => {
            jest.spyOn(getUserByIdService, 'execute').mockRejectedValue(
                new Error(),
            )

            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(500)
            expect(result.body?.status).toBe('error')
            expect(result.body?.message).toBeTruthy()
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
        it('should return 200 if user is found successfully', async () => {
            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(200)
            expect(result.body?.status).toBe('success')
            expect(result.body?.message).toBeTruthy()
            expect(result.body?.data).toBeTruthy()
            expect(result.body?.data?.id).toBeTruthy()
            expect(result.body?.data?.first_name).toBeTruthy()
            expect(result.body?.data?.last_name).toBeTruthy()
            expect(result.body?.data?.email).toBeTruthy()
            expect(result.body?.data).not.toHaveProperty('password')
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
