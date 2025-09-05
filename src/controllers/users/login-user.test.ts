import { LoginUserController } from './login-user'

import { LoginFailedError } from '@/errors'
import {
    ResponseMessage,
    TokensGeneratorAdapterResponse,
    UserRepositoryResponse,
} from '@/shared'
import {
    createUserRepositoryResponse,
    createUserServiceResponse,
    invalidEmailCases,
    invalidPasswordCases,
    loginUserHttpRequest as baseHttpRequest,
    tokensGeneratorAdapterResponse,
} from '@/test'

describe('LoginUserController', () => {
    let sut: LoginUserController
    let loginUserService: LoginUserServiceStub

    class LoginUserServiceStub {
        async execute(
            _email: string,
            _password: string,
        ): Promise<
            UserRepositoryResponse & { tokens: TokensGeneratorAdapterResponse }
        > {
            return Promise.resolve({
                ...createUserServiceResponse,
                password: createUserRepositoryResponse.password,
                tokens: tokensGeneratorAdapterResponse,
            })
        }
    }

    const makeSut = () => {
        const loginUserService = new LoginUserServiceStub()
        const sut = new LoginUserController(loginUserService)

        return {
            loginUserService,
            sut,
        }
    }

    beforeEach(() => {
        const { sut: controller, loginUserService: service } = makeSut()
        sut = controller
        loginUserService = service
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('error handling', () => {
        it('should return 404 if user is not found', async () => {
            jest.spyOn(loginUserService, 'execute').mockImplementationOnce(
                async () => {
                    throw new LoginFailedError()
                },
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(400)
            expect(response.body?.message).toBe(
                ResponseMessage.USER_INVALID_PASSWORD_OR_EMAIL,
            )
        })

        it('should return 401 and throws LoginFailedError if password is invalid', async () => {
            jest.spyOn(loginUserService, 'execute').mockImplementationOnce(
                async () => {
                    throw new LoginFailedError()
                },
            )

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(400)
            expect(response.body?.message).toBe(
                ResponseMessage.USER_INVALID_PASSWORD_OR_EMAIL,
            )
        })
    })

    describe('success', () => {
        it('should return 200 and the user when login is successful', async () => {
            const { sut } = makeSut()

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(200)
            expect(response.body?.data).toEqual({
                ...createUserServiceResponse,
                password: createUserRepositoryResponse.password,
                tokens: tokensGeneratorAdapterResponse,
            })
            expect(response.body?.message).toBe(
                ResponseMessage.USER_LOGIN_SUCCESS,
            )
        })
    })

    describe('validations', () => {
        describe('email', () => {
            it.each(invalidEmailCases)(
                'should return 400 and throws ZodError if email is $description',
                async ({ email, expectedMessage }) => {
                    // arrange
                    const response = await sut.execute({
                        body: {
                            email: email as string,
                            password: baseHttpRequest.body.password,
                        },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(expectedMessage)
                },
            )
        })

        describe('password', () => {
            it.each(invalidPasswordCases)(
                'should return 400 and throws ZodError if password is $description',
                async ({ password, expectedMessage }) => {
                    // arrange
                    const response = await sut.execute({
                        body: {
                            email: baseHttpRequest.body.email,
                            password: password as string,
                        },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(expectedMessage)
                },
            )
        })
    })
})
