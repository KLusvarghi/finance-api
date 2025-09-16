import { mock, MockProxy } from 'jest-mock-extended'

import { CreateUserController } from '@/controllers'
import { EmailAlreadyExistsError } from '@/errors'
import { CreateUserService } from '@/services'
import { HttpResponseSuccessBody } from '@/shared'
import {
    createUserControllerResponse,
    createUserHttpRequest as baseHttpRequest,
    createUserParams as params,
} from '@/test'

describe('CreateUserController', () => {
    let sut: CreateUserController
    let createUserService: MockProxy<CreateUserService>

    beforeEach(() => {
        // Setup executado antes de cada teste
        createUserService = mock<CreateUserService>()
        sut = new CreateUserController(createUserService)
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
            createUserService.execute.mockRejectedValue(genericError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                genericError,
            )
        })

        it('should throw EmailAlreadyExistsError when CreateUserService throws EmailAlreadyExistsError', async () => {
            // arrange
            const emailError = new EmailAlreadyExistsError(params.email)
            createUserService.execute.mockRejectedValue(emailError)

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
            createUserService.execute.mockResolvedValueOnce(
                createUserControllerResponse,
            )

            // act
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
            createUserService.execute.mockResolvedValueOnce(
                createUserControllerResponse,
            )

            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(createUserService.execute).toHaveBeenCalledWith(
                baseHttpRequest.body,
            )
            expect(createUserService.execute).toHaveBeenCalledTimes(1)
        })
    })
})
