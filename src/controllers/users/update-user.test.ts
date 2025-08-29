import { UpdateUserController } from '@/controllers'
import {
    EmailAlreadyExistsError,
    UpdateUserFailedError,
    UserNotFoundError,
} from '@/errors'
import {
    ResponseMessage,
    UpdateUserParams,
    UserRepositoryResponse,
} from '@/shared'
import {
    createInvalidIdCases,
    updateUserHttpRequest as baseHttpRequest,
    updateUserParams,
    updateUserRepositoryResponse,
    userId,
} from '@/test'

describe('UpdateUserController', () => {
    let sut: UpdateUserController
    let updateUserService: UpdateUserServiceStub

    class UpdateUserServiceStub {
        async execute(
            _userId: string,
            _params: UpdateUserParams,
        ): Promise<UserRepositoryResponse> {
            return Promise.resolve(updateUserRepositoryResponse)
        }
    }

    const makeSut = () => {
        const updateUserService = new UpdateUserServiceStub()
        const sut = new UpdateUserController(updateUserService)

        return {
            updateUserService,
            sut,
        }
    }

    beforeEach(() => {
        // Setup executado antes de cada teste
        const { sut: controller, updateUserService: service } = makeSut()
        sut = controller
        updateUserService = service
    })

    afterEach(() => {
        // Limpeza após cada teste
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('error handling', () => {
        it('should return 500 when UpdateUserService throws generic error', async () => {
            jest.spyOn(updateUserService, 'execute').mockRejectedValueOnce(
                new Error(),
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(500)
            expect(response.body?.message).toBeTruthy()
        })

        it('should return 400 when UpdateUserService throws EmailAlreadyExistsError', async () => {
            jest.spyOn(updateUserService, 'execute').mockRejectedValueOnce(
                new EmailAlreadyExistsError(baseHttpRequest.body.email),
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(400)
            expect(response.body?.message).toBeTruthy()
            expect(response.body?.message).toContain(baseHttpRequest.body.email)
            expect(response.body?.message).toContain('already in use')
        })

        it('should return 404 when UpdateUserService throws UserNotFoundError', async () => {
            jest.spyOn(updateUserService, 'execute').mockRejectedValueOnce(
                new UserNotFoundError(baseHttpRequest.params.userId),
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(404)
            expect(response.body?.message).toBeTruthy()
            expect(response.body?.message).toContain(
                baseHttpRequest.params.userId,
            )
        })

        it('should return 500 when UpdateUserService throws UpdateUserFailedError', async () => {
            jest.spyOn(updateUserService, 'execute').mockRejectedValueOnce(
                new UpdateUserFailedError(),
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(500)
            expect(response.body?.message).toBeTruthy()
        })
    })

    describe('validations', () => {
        describe('email', () => {
            it('should return 400 when invalid email is provided', async () => {
                const response = await sut.execute({
                    params: { userId: userId },
                    body: { ...updateUserParams, email: 'invalid_email' },
                })

                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBeTruthy()
            })
        })

        describe('password', () => {
            it('should return 400 when invalid password is provided', async () => {
                const response = await sut.execute({
                    params: { userId: userId },
                    body: {
                        ...updateUserParams,
                        password: '12345', // Less than 6 characters
                    },
                })

                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBeTruthy()
            })
        })

        describe('userId', () => {
            const invalidIdCases = createInvalidIdCases({
                missing: ResponseMessage.USER_ID_MISSING,
                invalid: ResponseMessage.USER_INVALID_ID,
            })

            it.each(invalidIdCases)(
                'should return 400 if userId is $description',
                async ({ id, expectedMessage }) => {
                    // arrange
                    const response = await sut.execute({
                        params: { userId: id },
                        body: updateUserParams,
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(expectedMessage)
                },
            )
        })

        describe('disallowed fields', () => {
            it('should return 400 when disallowed field is provided', async () => {
                const response = await sut.execute({
                    params: { userId: userId },
                    body: {
                        ...updateUserParams,
                        disallowed_field: 'disallowed_field',
                    },
                })

                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBeTruthy()
            })
        })
    })

    describe('success cases', () => {
        it('should return 200 when updating user successfully', async () => {
            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(200)
            expect(response.body?.message).toBeTruthy()
            expect(response.body?.data).toEqual(updateUserRepositoryResponse)
        })

        it('should call UpdateUserService with correct parameters', async () => {
            // arrange
            const spy = jest.spyOn(updateUserService, 'execute')

            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(spy).toHaveBeenCalledWith(
                baseHttpRequest.params.userId,
                baseHttpRequest.body,
            )
            expect(spy).toHaveBeenCalledTimes(1)
        })
    })
})
