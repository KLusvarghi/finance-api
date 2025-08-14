import { UpdateUserController } from './update-user'
import { UpdateUserParams, UserRepositoryResponse } from '@/shared'
import {
    EmailAlreadyExistsError,
    UpdateUserFailedError,
    UserNotFoundError,
} from '@/errors/user'
import {
    userId,
    updateUserParams,
    updateUserRepositoryResponse,
    updateUserHttpRequest as baseHttpRequest,
    invalidUUID,
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

            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(500)
            expect(result.body?.status).toBe('error')
            expect(result.body?.message).toBeTruthy()
        })

        it('should return 400 when UpdateUserService throws EmailAlreadyExistsError', async () => {
            jest.spyOn(updateUserService, 'execute').mockRejectedValueOnce(
                new EmailAlreadyExistsError(baseHttpRequest.body.email),
            )

            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(400)
            expect(result.body?.status).toBe('error')
            expect(result.body?.message).toBeTruthy()
            expect(result.body?.message).toContain(baseHttpRequest.body.email)
            expect(result.body?.message).toContain('already in use')
        })

        it('should return 404 when UpdateUserService throws UserNotFoundError', async () => {
            jest.spyOn(updateUserService, 'execute').mockRejectedValueOnce(
                new UserNotFoundError(baseHttpRequest.params.userId),
            )

            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(404)
            expect(result.body?.status).toBe('error')
            expect(result.body?.message).toBeTruthy()
            expect(result.body?.message).toContain(
                baseHttpRequest.params.userId,
            )
        })

        it('should return 500 when UpdateUserService throws UpdateUserFailedError', async () => {
            jest.spyOn(updateUserService, 'execute').mockRejectedValueOnce(
                new UpdateUserFailedError(),
            )

            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(500)
            expect(result.body?.status).toBe('error')
            expect(result.body?.message).toBeTruthy()
        })
    })

    describe('validations', () => {
        describe('email', () => {
            it('should return 400 when invalid email is provided', async () => {
                const result = await sut.execute({
                    params: { userId: userId },
                    body: { ...updateUserParams, email: 'invalid_email' },
                })

                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBeTruthy()
            })
        })

        describe('password', () => {
            it('should return 400 when invalid password is provided', async () => {
                const result = await sut.execute({
                    params: { userId: userId },
                    body: {
                        ...updateUserParams,
                        password: '12345', // Less than 6 characters
                    },
                })

                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBeTruthy()
            })
        })

        describe('userId', () => {
            it('should return 400 when userId is not provided', async () => {
                const result = await sut.execute({
                    params: { userId: undefined },
                    body: updateUserParams,
                })

                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBeTruthy()
                expect(result.body?.message).toBe('Missing param: userId')
            })

            it.each(invalidUUID)(
                'should return 400 if userId is $description',
                async ({ id }) => {
                    // arrange
                    const result = await sut.execute({
                        params: { userId: id },
                        body: updateUserParams,
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

        describe('disallowed fields', () => {
            it('should return 400 when disallowed field is provided', async () => {
                const result = await sut.execute({
                    params: { userId: userId },
                    body: {
                        ...updateUserParams,
                        disallowed_field: 'disallowed_field',
                    },
                })

                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBeTruthy()
            })
        })
    })

    describe('success cases', () => {
        it('should return 200 when updating user successfully', async () => {
            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(200)
            expect(result.body?.status).toBe('success')
            expect(result.body?.message).toBeTruthy()
            expect(result.body?.data).toEqual(updateUserRepositoryResponse)
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
