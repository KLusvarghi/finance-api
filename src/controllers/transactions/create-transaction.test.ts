import {
    CreateTransactionParams,
    HttpRequest,
    TransactionRepositoryResponse,
} from '@/shared'
import { CreateTransactionController } from './create-transaction'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import {
    invalidAmount,
    invalidDate,
    invalidType,
    invalidUUID,
} from '@/test'

describe('CreateTransactionController', () => {
    let sut: CreateTransactionController
    let createTransactionService: CreateTransactionServiceStub
    let validTransactionRequest: CreateTransactionParams
    let validTransactionResponse: TransactionRepositoryResponse
    let baseHttpRequest: HttpRequest

    class CreateTransactionServiceStub {
        async execute(
          _params: CreateTransactionParams,
        ): Promise<TransactionRepositoryResponse> {
            return Promise.resolve(validTransactionResponse)
        }
    }

    const makeSut = () => {
        const createTransactionService = new CreateTransactionServiceStub()
        const sut = new CreateTransactionController(createTransactionService)
        return { createTransactionService, sut }
    }

    beforeEach(() => {
        // Setup executado antes de cada teste, tendo que especificar o que cada um é, controller e service
        const { sut: controller, createTransactionService: service } = makeSut()

        sut = controller
        createTransactionService = service

        // Request válido (entrada do controller)
        validTransactionRequest = {
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: faker.helpers.arrayElement([
                'EARNING',
                'EXPENSE',
                'INVESTMENT',
            ]),
            amount: Number(faker.finance.amount()),
        }

        // Resposta válida do serviço/repositório
        validTransactionResponse = {
            id: faker.string.uuid(),
            user_id: validTransactionRequest.user_id,
            name: validTransactionRequest.name,
            amount: new Prisma.Decimal(Number(faker.finance.amount())),
            date: faker.date.anytime(),
            type: validTransactionRequest.type,
        }

        baseHttpRequest = {
            body: validTransactionRequest,
        }
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('error handling', () => {
        it('should return 500 if CreateTransactionService throws generic error', async () => {
            // arrange
            jest.spyOn(
                createTransactionService,
                'execute',
            ).mockRejectedValueOnce(new Error())

            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(500)
            expect(response.body?.status).toBe('error')
        })
    })

    describe('validations', () => {
        describe('user_id', () => {
            it('should return 400 if user_id is not provided', async () => {
                // arrange
                const response = await sut.execute({
                    body: {
                        ...validTransactionRequest,
                        user_id: undefined,
                    },
                })

                // assaert
                expect(response.statusCode).toBe(400)
                expect(response.body?.status).toBe('error')
                // expect(response.body?.message).toBeTruthy()
            })

            it.each(invalidUUID)(
                'should return 400 if user_id is $description',
                async ({ id }) => {
                    // arrange
                    const response = await sut.execute({
                        body: {
                            ...validTransactionRequest,
                            user_id: id,
                        },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.status).toBe('error')
                    expect(response.body?.message).toBe(
                        'User id must be a valid uuid',
                    )
                },
            )
        })
        describe('name', () => {
            it('should return 400 if name is not provided', async () => {
                // arrange
                const response = await sut.execute({
                    body: {
                        ...validTransactionRequest,
                        name: undefined,
                    },
                })

                // assert
                expect(response.statusCode).toBe(400)
                expect(response.body?.status).toBe('error')
            })

            it('should return 400 if name is too short', async () => {
                // arrange
                const response = await sut.execute({
                    body: {
                        ...validTransactionRequest,
                        name: 'A',
                    },
                })

                expect(response.statusCode).toBe(400)
                expect(response.body?.status).toBe('error')
                expect(response.body?.message).toBe(
                    'Name must be at least 3 characters long',
                )
            })

            it('should return 400 if name is too long', async () => {
                // arrange
                const response = await sut.execute({
                    body: {
                        ...validTransactionRequest,
                        name: 'A'.repeat(101),
                    },
                })

                expect(response.statusCode).toBe(400)
                expect(response.body?.status).toBe('error')
                expect(response.body?.message).toBe(
                    'Name must be at most 100 characters long',
                )
            })
        })

        describe('date', () => {
            it('should return 400 if date is not provided', async () => {
                // arrange
                const response = await sut.execute({
                    body: {
                        ...validTransactionRequest,
                        date: undefined,
                    },
                })

                expect(response.statusCode).toBe(400)
            })

            it.each(invalidDate)(
                'should return 400 if date is $description',
                async ({ date }) => {
                    // arrange
                    const response = await sut.execute({
                        body: {
                            ...validTransactionRequest,
                            date: date,
                        },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.status).toBe('error')
                    expect(response.body?.message).toBe(
                        'Date must be a valid date',
                    )
                },
            )
        })
        describe('type', () => {
            it('should return 400 if type is not provided', async () => {
                // arrange
                const response = await sut.execute({
                    body: {
                        ...validTransactionRequest,
                        type: undefined,
                    },
                })

                expect(response.statusCode).toBe(400)
                expect(response.body?.status).toBe('error')
                expect(response.body?.message).toBe(
                    'Type must be EARNING, EXPENSE or INVESTMENT',
                )
            })

            it.each(invalidType)(
                'should return 400 if type is $description',
                async ({ type }) => {
                    // arrange
                    const response = await sut.execute({
                        body: {
                            ...validTransactionRequest,
                            type: type,
                        },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.status).toBe('error')
                    expect(response.body?.message).toBe(
                        'Type must be EARNING, EXPENSE or INVESTMENT',
                    )
                },
            )
        })
        describe('amount', () => {
            it('should return 400 if amount is not provided', async () => {
                // arrange
                const response = await sut.execute({
                    body: {
                        ...validTransactionRequest,
                        amount: undefined,
                    },
                })

                // assert
                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBe('Amount is required')
            })

            it.each([undefined, null, ''])(
                'should return 400 if amount is not provided',
                async (amount: any) => {
                    // arrange
                    const response = await sut.execute({
                        body: {
                            ...validTransactionRequest,
                            amount: amount,
                        },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.status).toBe('error')
                    expect(response.body?.message).toBe('Amount is required')
                },
            )

            it.each(invalidAmount)(
                'should return 400 if amount is $description',
                async ({ amount }) => {
                    // arrange
                    const response = await sut.execute({
                        body: {
                            ...validTransactionRequest,
                            amount: amount,
                        },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.status).toBe('error')
                },
            )
        })
    })

    describe('succes cases', () => {
        it('should return 201 when creating transaction successfully', async () => {
            // arrange
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(201)
            expect(response.body?.status).toBe('success')
            // expect(response.body?.data).toMatchObject(validTransactionData)
        })

        it('should call CreateTransactionService with correct parameters', async () => {
            // arrange
            const executeSpy = jest.spyOn(createTransactionService, 'execute')

            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.body)
            expect(executeSpy).toHaveBeenCalledTimes(1)
        })
    })
})
