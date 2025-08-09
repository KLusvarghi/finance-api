import { HttpRequest, UserRepositoryResponse } from '@/shared'
import { DeleteUserController } from './delete-user'
import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '@/errors/user'

describe('DeleteUserController', () => {
    let sut: DeleteUserController
    let deleteUserService: DeleteUserServiceStub
    let validUserId: string
    let validUserResponse: UserRepositoryResponse
    let baseHttpRequest: HttpRequest

    class DeleteUserServiceStub {
        execute(_userId: string): Promise<UserRepositoryResponse> {
            return Promise.resolve(validUserResponse)
        }
    }

    const makeSut = () => {
        const deleteUserService = new DeleteUserServiceStub()
        const sut = new DeleteUserController(deleteUserService)

        return { deleteUserService, sut }
    }

    beforeEach(() => {
        // Setup executado antes de cada teste
        const { sut: controller, deleteUserService: service } = makeSut()
        sut = controller
        deleteUserService = service

        // Dados válidos sempre disponíveis
        validUserId = faker.string.uuid()
        validUserResponse = {
            id: validUserId,
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        }

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
            jest.spyOn(deleteUserService, 'execute').mockImplementationOnce(
                async () => {
                    throw new UserNotFoundError(validUserId)
                },
            )

            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(404)
            expect(result.body?.status).toBe('error')
            expect(result.body?.message).toBeTruthy()
        })

        it('should return 500 if DeleteUserService throws', async () => {
            jest.spyOn(deleteUserService, 'execute').mockRejectedValueOnce(
                () => {
                    new Error()
                },
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
                expect(result.body?.message).toBeTruthy()
                expect(result.body?.message).toBe('Missing param: userId')
            })

            it('should return 400 if userId is invalid', async () => {
                const result = await sut.execute({
                    params: { userId: 'invalid-uuid' },
                })

                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBeTruthy()
            })
        })
    })

    describe('success cases', () => {
        it('should return 200 if user is deleted successfully', async () => {
            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(200)
            expect(result.body?.status).toBe('success')
            expect(result.body?.message).toBeTruthy()
            expect(result.body?.data).toEqual(validUserResponse)
        })

        it('should call DeleteUserService with correct parameters', async () => {
            // arrange
            const spy = jest.spyOn(deleteUserService, 'execute')

            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(spy).toHaveBeenCalledWith(baseHttpRequest.params.userId)
            expect(spy).toHaveBeenCalledTimes(1)
        })
    })
})
