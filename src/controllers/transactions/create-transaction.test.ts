import { CreateTransactionController } from '@/controllers'
import { CreateTransactionParams, TransactionPublicResponse } from '@/shared'
import {
    createTransactionControllerResponse,
    createTransactionHttpRequest as baseHttpRequest,
    createTransactionParams as params,
    invalidAmount,
    invalidDate,
    invalidType,
    invalidUUID,
} from '@/test'

describe('CreateTransactionController', () => {
    let sut: CreateTransactionController
    let createTransactionService: CreateTransactionServiceStub

    class CreateTransactionServiceStub {
        async execute(
            _params: CreateTransactionParams,
        ): Promise<TransactionPublicResponse> {
            return Promise.resolve(createTransactionControllerResponse)
        }
    }

    const makeSut = () => {
        const createTransactionService = new CreateTransactionServiceStub()
        const sut = new CreateTransactionController(createTransactionService)
        return { createTransactionService, sut }
    }

    beforeEach(() => {
        // Setup executado antes de cada teste
        const { sut: controller, createTransactionService: service } = makeSut()
        sut = controller
        createTransactionService = service
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
        })
    })

    describe('validations', () => {
        describe('user_id', () => {
            it('should return 400 if user_id is not provided', async () => {
                // arrange
                const response = await sut.execute({
                    body: {
                        ...params,
                        user_id: undefined,
                    },
                })

                // assert
                expect(response.statusCode).toBe(400)
                // expect(response.body?.message).toBe('User id is required')
            })

            it.each(invalidUUID)(
                'should return 400 if user_id is $description',
                async ({ id }) => {
                    // arrange
                    const response = await sut.execute({
                        body: {
                            ...params,
                            user_id: id,
                        },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    // expect(response.body?.message).toBe(
                    //     'User id must be a valid uuid',
                    // )
                },
            )
        })
        describe('name', () => {
            it('should return 400 if name is not provided', async () => {
                // arrange
                const response = await sut.execute({
                    body: {
                        ...params,
                        name: undefined,
                    },
                })

                // assert
                expect(response.statusCode).toBe(400)
            })

            it('should return 400 if name is too short', async () => {
                // arrange
                const response = await sut.execute({
                    body: {
                        ...params,
                        name: 'A',
                    },
                })

                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBe(
                    'Name must be at least 3 characters long',
                )
            })

            it('should return 400 if name is too long', async () => {
                // arrange
                const response = await sut.execute({
                    body: {
                        ...params,
                        name: 'A'.repeat(101),
                    },
                })

                expect(response.statusCode).toBe(400)
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
                        ...params,
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
                            ...params,
                            date: date,
                        },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
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
                        ...params,
                        type: undefined,
                    },
                })

                expect(response.statusCode).toBe(400)
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
                            ...params,
                            type: type,
                        },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    // expect(response.body?.message).toBe(
                    //     'Type must be EARNING, EXPENSE or INVESTMENT',
                    // )
                },
            )
        })
        describe('amount', () => {
            it('should return 400 if amount is not provided', async () => {
                // arrange
                const response = await sut.execute({
                    body: {
                        ...params,
                        amount: undefined,
                    },
                })

                // assert
                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBe('Amount is required')
            })

            it.each([undefined, null, ''])(
                'should return 400 if amount is not provided',
                async (amount: number | undefined | null | string) => {
                    // arrange
                    const response = await sut.execute({
                        body: {
                            ...params,
                            amount: amount,
                        },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe('Amount is required')
                },
            )

            it.each(invalidAmount)(
                'should return 400 if amount is $description',
                async ({ amount, expectedMessage }) => {
                    // arrange
                    const response = await sut.execute({
                        body: {
                            ...params,
                            amount: amount,
                        },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(expectedMessage)
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
