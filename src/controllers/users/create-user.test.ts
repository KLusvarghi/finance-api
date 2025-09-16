import { CreateUserController } from '@/controllers'
import { EmailAlreadyExistsError } from '@/errors'
import {
    CreateUserParams,
    HttpResponseSuccessBody,
    UserWithTokensResponse,
} from '@/shared'
import {
    createUserControllerResponse,
    createUserHttpRequest as baseHttpRequest,
    createUserParams as params,
} from '@/test'

describe('CreateUserController', () => {
    let sut: CreateUserController
    let createUserService: CreateUserServiceStub

    class CreateUserServiceStub {
        async execute(
            _params: CreateUserParams,
        ): Promise<UserWithTokensResponse> {
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
        it('should throw generic error when CreateUserService throws generic error', async () => {
            // arrange
            const genericError = new Error('Generic service error')
            jest.spyOn(createUserService, 'execute').mockRejectedValueOnce(
                genericError,
            )

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                genericError,
            )
        })

        it('should throw EmailAlreadyExistsError when CreateUserService throws EmailAlreadyExistsError', async () => {
            // arrange
            const emailError = new EmailAlreadyExistsError(params.email)
            jest.spyOn(createUserService, 'execute').mockRejectedValueOnce(
                emailError,
            )

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                EmailAlreadyExistsError,
            )
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                `The e-mail ${params.email} is already in use`,
            )
        })
    })

    describe('success cases', () => {
        it('should create a new user successfully and return 201', async () => {
            // arrange
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(201)
            expect(response.body?.success).toBe(true)
            expect(
                (response.body as HttpResponseSuccessBody)?.data,
            ).toMatchObject(createUserControllerResponse)
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
