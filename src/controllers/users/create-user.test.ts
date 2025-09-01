import { CreateUserController } from '@/controllers'
import { EmailAlreadyExistsError } from '@/errors'
import {
    CreateUserParams,
    ResponseZodMessages,
    UserPublicResponse,
} from '@/shared'
import {
    createInvalidNameCases,
    createUserControllerResponse,
    createUserHttpRequest as baseHttpRequest,
    createUserParams as params,
    invalidEmailCases,
    invalidPasswordCases,
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
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(500)
        })

        it('should return 400 if CreateUserService throws EmailAlreadyExistsError', async () => {
            // arrange
            jest.spyOn(createUserService, 'execute').mockRejectedValueOnce(
                new EmailAlreadyExistsError(params.email),
            )

            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(400)
            expect(response.body?.message).toContain(params.email)
        })
    })

    describe('validations', () => {
        describe('first_name', () => {
            const invalidNameCases = createInvalidNameCases({
                required: ResponseZodMessages.first_name.required,
                minLength: ResponseZodMessages.first_name.minLength,
            })
            it.each(invalidNameCases)(
                'should return 400 if first_name is $description',
                async ({ name, expectedMessage }) => {
                    // arrange

                    const response = await sut.execute({
                        body: { ...params, first_name: name as string },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(expectedMessage)
                },
            )
        })

        describe('last_name', () => {
            const invalidNameCases = createInvalidNameCases({
                required: ResponseZodMessages.last_name.required,
                minLength: ResponseZodMessages.last_name.minLength,
            })
            it.each(invalidNameCases)(
                'should return 400 if last_name is $description',
                async ({ name, expectedMessage }) => {
                    // arrange

                    const response = await sut.execute({
                        body: { ...params, last_name: name as string },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(expectedMessage)
                },
            )
        })

        describe('email', () => {
            it.each(invalidEmailCases)(
                'should return 400 if email is $description',
                async ({ email, expectedMessage }) => {
                    // arrange

                    const response = await sut.execute({
                        body: { ...params, email: email as string },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(expectedMessage)
                },
            )
        })

        describe('password', () => {
            it.each(invalidPasswordCases)(
                'should return 400 if password is $description',
                async ({ password, expectedMessage }) => {
                    // arrange

                    const response = await sut.execute({
                        body: { ...params, password: password as string },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(expectedMessage)
                },
            )
        })

        describe('success cases', () => {
            it('should create a new user successfully and return 201', async () => {
                // arrange
                const response = await sut.execute(baseHttpRequest)

                // assert
                expect(response.statusCode).toBe(201)
                expect(response.body?.data).toMatchObject(
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
})
