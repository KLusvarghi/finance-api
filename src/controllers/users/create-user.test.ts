import { EmailAlreadyExistsError } from '@/errors/user'
import { CreateUserController } from './create-user'
import { CreateUserParams, UserPublicResponse } from '@/shared'
import {
    createUserParams as params,
    createUserControllerResponse,
    createUserHttpRequest as baseHttpRequest,
} from '@/test'

describe('CreateUserController', () => {
    let sut: CreateUserController
    let createUserService: CreateUserServiceStub

    class CreateUserServiceStub {
        async execute(_params: CreateUserParams): Promise<UserPublicResponse> {
            return Promise.resolve(createUserControllerResponse)
        }
    }

    const makeSut = () => {
        const createUserService = new CreateUserServiceStub()
        const sut = new CreateUserController(createUserService)
        return { createUserService, sut }
    }

    beforeEach(() => {
        // Setup executado antes de cada teste
        const { sut: controller, createUserService: service } = makeSut()
        sut = controller
        createUserService = service
    })

    afterEach(() => {
        // Limpeza após cada teste
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('error handling', () => {
        it('should return 500 if CreateUserService throws generic error', async () => {
            // arrange
            jest.spyOn(createUserService, 'execute').mockRejectedValueOnce(
                new Error(),
            )

            // act
            const result = await sut.execute(baseHttpRequest)

            // assert
            expect(result.statusCode).toBe(500)
            expect(result.body?.status).toBe('error')
        })

        it('should return 400 if CreateUserService throws EmailAlreadyExistsError', async () => {
            // arrange
            jest.spyOn(createUserService, 'execute').mockRejectedValueOnce(
                new EmailAlreadyExistsError(params.email),
            )

            // act
            const result = await sut.execute(baseHttpRequest)

            // assert
            expect(result.statusCode).toBe(400)
            expect(result.body?.message).toContain(params.email)
        })
    })

    describe('validations', () => {
        describe('first_name', () => {
            it('should return 400 if first_name is not provided', async () => {
                // arrange
                const result = await sut.execute({
                    body: { ...params, first_name: undefined },
                })

                // assert
                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBeTruthy()
            })

            it('should return 400 if first_name is too short', async () => {
                // arrange
                const result = await sut.execute({
                    body: { ...params, first_name: 'A' },
                })

                // assert
                expect(result.statusCode).toBe(400)
            })
        })

        describe('last_name', () => {
            it('should return 400 if last_name is not provided', async () => {
                // arrange
                const result = await sut.execute({
                    body: { ...params, last_name: undefined },
                })

                // assert
                expect(result.statusCode).toBe(400)
            })
        })

        describe('email', () => {
            it('should return 400 if email is not provided', async () => {
                // arrange
                const result = await sut.execute({
                    body: { ...params, email: undefined },
                })

                // assert
                expect(result.statusCode).toBe(400)
            })

            it('should return 400 if email is invalid', async () => {
                // arrange
                const result = await sut.execute({
                    body: { ...params, email: 'invalid' },
                })

                // assert
                expect(result.statusCode).toBe(400)
            })
        })

        describe('password', () => {
            it('should return 400 if password is not provided', async () => {
                // arrange
                const result = await sut.execute({
                    body: { ...params, password: undefined },
                })

                // assert
                expect(result.statusCode).toBe(400)
            })

            it('should return 400 if password is less than 6 characters', async () => {
                // arrange
                const result = await sut.execute({
                    body: {
                        ...params,
                        password: '12345', // Less than 6 characters
                    },
                })

                // assert
                expect(result.statusCode).toBe(400)
            })
        })
    })

    describe('success cases', () => {
        it('should create a new user successfully and return 201', async () => {
            // arrange
            const result = await sut.execute(baseHttpRequest)

            // assert
            expect(result.statusCode).toBe(201)
            expect(result.body?.status).toBe('success')
            expect(result.body?.data).toMatchObject(
                createUserControllerResponse,
            )
        })

        it('should call CreateUserService with correct parameters', async () => {
            // arrange
            const spy = jest.spyOn(createUserService, 'execute')

            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(spy).toHaveBeenCalledWith(baseHttpRequest.body)
            expect(spy).toHaveBeenCalledTimes(1)
        })
    })
})
