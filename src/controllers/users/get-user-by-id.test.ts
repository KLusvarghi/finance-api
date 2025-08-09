import { HttpRequest, UserPublicResponse } from '@/shared'
import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id'
import { UserNotFoundError } from '@/errors/user'

describe('GetUserByIdController', () => {
    let sut: GetUserByIdController
    let getUserByIdService: GetUserByIdServiceStub
    let validUserId: string
    let baseHttpRequest: HttpRequest

    class GetUserByIdServiceStub {
        async execute(userId: string): Promise<UserPublicResponse> {
            return Promise.resolve({
                id: userId,
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
            })
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

        // Dados válidos sempre disponíveis
        validUserId = faker.string.uuid()
        baseHttpRequest = {
            params: { userId: validUserId },
        }
    })

    afterEach(() => {
        // Limpeza após cada teste
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('error handling', () => {
        it('should return 404 if user is not found', async () => {
            jest.spyOn(getUserByIdService, 'execute').mockRejectedValue(
                new UserNotFoundError(validUserId),
            )

            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(404)
            expect(result.body?.status).toBe('error')
            expect(result.body?.message).toBeTruthy()
            expect(result.body?.message).toContain(validUserId)
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
            it('should return 404 if userId is not provided', async () => {
                const result = await sut.execute({ params: { userId: '' } })

                expect(result.statusCode).toBe(404)
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBeTruthy()
            })

            it('should return 400 if userId is invalid', async () => {
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
