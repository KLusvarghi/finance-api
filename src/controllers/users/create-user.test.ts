import { EmailAlreadyExistsError } from '@/errors/user'
import { CreateUserController } from './create-user'
import { faker } from '@faker-js/faker'
import { CreateUserParams } from '@/shared'

describe('CreateUserController', () => {
    let sut: CreateUserController
    let createUserService: CreateUserServiceStub
    let validUserData: any

    class CreateUserServiceStub {
        async execute(params: CreateUserParams) {
            return params
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

        // Dados válidos sempre disponíveis
        validUserData = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        }
    })

    afterEach(() => {
        // Limpeza após cada teste
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('validations', () => {
        describe('first_name', () => {
            it('should return 400 if first_name is not provided', async () => {
                const result = await sut.execute({
                    body: { ...validUserData, first_name: undefined },
                })
                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBeTruthy()
            })

            it('should return 400 if first_name is too short', async () => {
                const result = await sut.execute({
                    body: { ...validUserData, first_name: 'A' },
                })
                expect(result.statusCode).toBe(400)
            })
        })

        describe('last_name', () => {
            it('should return 400 if last_name is not provided', async () => {
                const result = await sut.execute({
                    body: { ...validUserData, last_name: undefined },
                })
                expect(result.statusCode).toBe(400)
            })
        })

        describe('email', () => {
            it('should return 400 if email is not provided', async () => {
                const result = await sut.execute({
                    body: { ...validUserData, email: undefined },
                })
                expect(result.statusCode).toBe(400)
            })

            it('should return 400 if email is invalid', async () => {
                const result = await sut.execute({
                    body: { ...validUserData, email: 'invalid' },
                })
                expect(result.statusCode).toBe(400)
            })
        })

        describe('password', () => {
            it('should return 400 if password is not provided', async () => {
                const result = await sut.execute({
                    body: { ...validUserData, password: undefined },
                })
                expect(result.statusCode).toBe(400)
            })

            it('should return 400 if password is less than 6 characters', async () => {
                const result = await sut.execute({
                    body: {
                        ...validUserData,
                        password: faker.internet.password({ length: 5 }),
                    },
                })
                expect(result.statusCode).toBe(400)
            })
        })
    })

    describe('success cases', () => {
        it('should create a new user successfully and return 201', async () => {
            const result = await sut.execute({ body: validUserData })
            expect(result.statusCode).toBe(201)
            expect(result.body?.status).toBe('success')
            expect(result.body?.data).toMatchObject(validUserData)
        })

        it('should call CreateUserService with correct parameters', async () => {
            const spy = jest.spyOn(createUserService, 'execute')
            await sut.execute({ body: validUserData })
            expect(spy).toHaveBeenCalledWith(validUserData)
            expect(spy).toHaveBeenCalledTimes(1)
        })
    })

    describe('error handling', () => {
        it('should return 500 if CreateUserService throws generic error', async () => {
            jest.spyOn(createUserService, 'execute').mockRejectedValueOnce(
                new Error(),
            )
            const result = await sut.execute({ body: validUserData })
            expect(result.statusCode).toBe(500)
            expect(result.body?.status).toBe('error')
        })

        it('should return 400 if CreateUserService throws EmailAlreadyExistsError', async () => {
            jest.spyOn(createUserService, 'execute').mockRejectedValueOnce(
                new EmailAlreadyExistsError(validUserData.email),
            )
            const result = await sut.execute({ body: validUserData })
            expect(result.statusCode).toBe(400)
            expect(result.body?.message).toContain(validUserData.email)
        })
    })
})
