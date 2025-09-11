import { AuthenticateUserController } from './authenticate-user'

import { LoginFailedError } from '@/errors'
import {
    HttpResponseSuccessBody,
    ResponseMessage,
    TokensGeneratorAdapterResponse,
    UserRepositoryResponse,
} from '@/shared'
import {
    createUserRepositoryResponse,
    createUserServiceResponse,
    loginUserHttpRequest as baseHttpRequest,
    tokensGeneratorAdapterResponse,
} from '@/test'

describe('AuthenticateUserController', () => {
    let sut: AuthenticateUserController
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
        const sut = new AuthenticateUserController(loginUserService)

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
        it('should throw LoginFailedError when user is not found', async () => {
            const loginFailedError = new LoginFailedError()
            jest.spyOn(loginUserService, 'execute').mockImplementationOnce(
                async () => {
                    throw loginFailedError
                },
            )

            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                LoginFailedError,
            )
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                ResponseMessage.USER_INVALID_PASSWORD_OR_EMAIL,
            )
        })

        it('should throw LoginFailedError when password is invalid', async () => {
            const loginFailedError = new LoginFailedError()
            jest.spyOn(loginUserService, 'execute').mockImplementationOnce(
                async () => {
                    throw loginFailedError
                },
            )

            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                LoginFailedError,
            )
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                ResponseMessage.USER_INVALID_PASSWORD_OR_EMAIL,
            )
        })
    })

    describe('success', () => {
        it('should return 200 and the user when login is successful', async () => {
            const { sut } = makeSut()

            const response = await sut.execute(baseHttpRequest)

            expect(response.statusCode).toBe(200)
            expect(response.body?.success).toBe(true)
            expect((response.body as HttpResponseSuccessBody)?.data).toEqual({
                ...createUserServiceResponse,
                password: createUserRepositoryResponse.password,
                tokens: tokensGeneratorAdapterResponse,
            })
            expect(response.body?.message).toBe(
                ResponseMessage.USER_LOGIN_SUCCESS,
            )
        })
    })
})
