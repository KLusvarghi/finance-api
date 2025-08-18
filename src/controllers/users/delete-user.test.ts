import { DeleteUserController } from '@/controllers'
import { UserNotFoundError } from '@/errors'
import { ResponseMessage, UserRepositoryResponse } from '@/shared'
import {
    deleteUserHttpRequest as baseHttpRequest,
    deleteUserRepositoryResponse,
    invalidUUID,
    userId,
} from '@/test'

describe('DeleteUserController', () => {
    let sut: DeleteUserController
    let deleteUserService: DeleteUserServiceStub

    class DeleteUserServiceStub {
        execute(_userId: string): Promise<UserRepositoryResponse> {
            return Promise.resolve(deleteUserRepositoryResponse)
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
                    throw new UserNotFoundError(userId)
                },
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(404)
            expect(response.body?.message).toBe(
                `User with id ${userId} not found`,
            )
        })

        it('should return 500 if DeleteUserService throws', async () => {
            jest.spyOn(deleteUserService, 'execute').mockRejectedValueOnce(
                () => {
                    new Error()
                },
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(500)
            expect(response.body?.message).toBe(ResponseMessage.SERVER_ERROR)
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

            it.each(invalidUUID)(
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
        it('should return 200 if user is deleted successfully', async () => {
            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(200)
            expect(response.body?.message).toBe(ResponseMessage.USER_DELETED)
            expect(response.body?.data).toEqual(deleteUserRepositoryResponse)
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
