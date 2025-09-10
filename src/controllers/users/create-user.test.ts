import { CreateUserController } from '@/controllers'
import { EmailAlreadyExistsError } from '@/errors'
import {
    CreateUserParams,
    HttpResponseSuccessBody,
    UserPublicResponse,
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
            expect(response.body?.success).toBe(false)
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
            expect(response.body?.success).toBe(false)
            expect(response.body?.message).toContain(params.email)
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
