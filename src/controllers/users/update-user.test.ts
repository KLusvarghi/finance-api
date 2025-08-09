import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user'
import { HttpRequest, UpdateUserParams, UserRepositoryResponse } from '@/shared'
import { EmailAlreadyExistsError } from '@/errors/user'

describe('UpdateUserController', () => {
    let sut: UpdateUserController
    let updateUserService: UpdateUserServiceStub
    let validUserId: string
    let validUpdateRequest: UpdateUserParams
    let validUpdateResponse: UserRepositoryResponse
    let baseHttpRequest: HttpRequest

    class UpdateUserServiceStub {
        async execute(
            _userId: string,
            _params: UpdateUserParams,
        ): Promise<UserRepositoryResponse> {
            return Promise.resolve(validUpdateResponse)
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

        // Dados válidos sempre disponíveis
        validUserId = faker.string.uuid()
        validUpdateRequest = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        }
        validUpdateResponse = {
            id: validUserId,
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        }
        baseHttpRequest = {
            params: { userId: validUserId },
            body: validUpdateRequest,
        }
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
            const duplicateEmail = faker.internet.email()
            jest.spyOn(updateUserService, 'execute').mockRejectedValueOnce(
                new EmailAlreadyExistsError(duplicateEmail),
            )

            const result = await sut.execute(baseHttpRequest)

            expect(result.statusCode).toBe(400)
            expect(result.body?.status).toBe('error')
            expect(result.body?.message).toBeTruthy()
            expect(result.body?.message).toContain(duplicateEmail)
            expect(result.body?.message).toContain('already in use')
        })
    })

    describe('validations', () => {
        describe('email', () => {
            it('should return 400 when invalid email is provided', async () => {
                const result = await sut.execute({
                    params: { userId: validUserId },
                    body: { ...validUpdateRequest, email: 'invalid_email' },
                })

                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBeTruthy()
            })
        })

        describe('password', () => {
            it('should return 400 when invalid password is provided', async () => {
                const result = await sut.execute({
                    params: { userId: validUserId },
                    body: {
                        ...validUpdateRequest,
                        password: faker.internet.password({ length: 5 }),
                    },
                })

                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBeTruthy()
            })
        })

        describe('userId', () => {
            it('should return 400 when invalid userId is provided', async () => {
                const result = await sut.execute({
                    params: { userId: 'invalid_id' },
                    body: validUpdateRequest,
                })

                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBeTruthy()
            })
        })

        describe('disallowed fields', () => {
            it('should return 400 when disallowed field is provided', async () => {
                const result = await sut.execute({
                    params: { userId: validUserId },
                    body: {
                        ...validUpdateRequest,
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
            expect(result.body?.data).toEqual(validUpdateResponse)
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
