import { UpdateTransactionController } from '@/controllers'
import {
    ResponseMessage,
    ResponseZodMessages,
    TransactionRepositoryResponse,
    UpdateTransactionParams,
} from '@/shared'
import {
    createInvalidIdCases,
    invalidAmountCases,
    invalidDateCases,
    invalidTypeCases,
    updateTransactionControllerResponse,
    updateTransactionHttpRequest as baseHttpRequest,
} from '@/test'

describe('UpdateTransactionController', () => {
    let sut: UpdateTransactionController
    let updateTransactionService: UpdateTransactionServiceStub

    class UpdateTransactionServiceStub {
        execute(
            _transactionId: string,
            _params: UpdateTransactionParams,
        ): Promise<TransactionRepositoryResponse> {
            return Promise.resolve(updateTransactionControllerResponse)
        }
    }

    const makeSut = () => {
        const updateTransactionService = new UpdateTransactionServiceStub()
        const sut = new UpdateTransactionController(updateTransactionService)

        return { sut, updateTransactionService }
    }

    beforeEach(() => {
        const { sut: controller, updateTransactionService: service } = makeSut()

        sut = controller
        updateTransactionService = service
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('error handling', () => {
        it('should return 500 if UpdateTransactionService throws generic error', async () => {
            jest.spyOn(
                updateTransactionService,
                'execute',
            ).mockRejectedValueOnce(new Error())

            const response = await sut.execute({
                ...baseHttpRequest,
            })

            expect(response.statusCode).toBe(500)
        })
    })

    describe('validations', () => {
        const invalidIdCases = createInvalidIdCases({
            missing: ResponseMessage.TRANSACTION_ID_MISSING,
            invalid: ResponseMessage.TRANSACTION_INVALID_ID,
        })

        it.each(invalidIdCases)(
            'should return 400 and throws ZodError if transactionId is $description',
            async ({ id, expectedMessage }) => {
                // act
                const response = await sut.execute({
                    ...baseHttpRequest,
                    params: {
                        transactionId: id as string,
                    },
                })

                // assert
                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBe(expectedMessage)
            },
        )

        describe('validations', () => {
            it('should accept empty body (no fields provided)', async () => {
                const executeSpy = jest.spyOn(
                    updateTransactionService,
                    'execute',
                )

                const response = await sut.execute({
                    ...baseHttpRequest,
                    body: {},
                })

                expect(response.statusCode).toBe(200)
                expect(executeSpy).toHaveBeenCalledWith(
                    baseHttpRequest.params.transactionId,
                    {
                        userId: baseHttpRequest.headers.userId,
                    },
                )
            })

            describe('name', () => {
                it('should return 400 if name is too short', async () => {
                    const response = await sut.execute({
                        ...baseHttpRequest,
                        body: {
                            ...baseHttpRequest.body,
                            name: 'A',
                        },
                    })

                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(
                        ResponseZodMessages.name.minLength,
                    )
                })

                it('should return 400 if name is too long', async () => {
                    const response = await sut.execute({
                        ...baseHttpRequest,
                        body: {
                            ...baseHttpRequest.body,
                            name: 'A'.repeat(101),
                        },
                    })

                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(
                        ResponseZodMessages.name.maxLength,
                    )
                })
            })

            describe('date', () => {
                it('should return 200 if date is not provided', async () => {
                    const response = await sut.execute({
                        ...baseHttpRequest,
                        body: {
                            ...baseHttpRequest.body,
                            date: undefined,
                        } as UpdateTransactionParams,
                        headers: { userId: baseHttpRequest.headers.userId },
                    })
                    expect(response.statusCode).toBe(200)
                })
                it.each(invalidDateCases)(
                    'should return 400 if date is $description',
                    async ({ date, expectedMessage }) => {
                        const response = await sut.execute({
                            ...baseHttpRequest,
                            body: {
                                ...baseHttpRequest.body,
                                date: date as string,
                            } as UpdateTransactionParams,
                            headers: { userId: baseHttpRequest.headers.userId },
                        })

                        expect(response.statusCode).toBe(400)
                        expect(response.body?.message).toBe(expectedMessage)
                    },
                )
            })

            describe('type', () => {
                it('should return 200 if type is not provided', async () => {
                    const response = await sut.execute({
                        ...baseHttpRequest,
                        body: {
                            ...baseHttpRequest.body,
                            type: undefined,
                        } as UpdateTransactionParams,
                        headers: { userId: baseHttpRequest.headers.userId },
                    })
                    expect(response.statusCode).toBe(200)
                })
                it.each(invalidTypeCases)(
                    'should return 400 if type is $description',
                    async ({ type, expectedMessage }) => {
                        const response = await sut.execute({
                            ...baseHttpRequest,
                            body: {
                                ...baseHttpRequest.body,
                                type: type,
                            } as UpdateTransactionParams,
                            headers: { userId: baseHttpRequest.headers.userId },
                        })

                        expect(response.statusCode).toBe(400)
                        expect(response.body?.message).toBe(expectedMessage)
                    },
                )
            })

            describe('amount', () => {
                it.each(invalidAmountCases)(
                    'should return 400 if amount is $description',
                    async ({ amount, expectedMessage }) => {
                        const response = await sut.execute({
                            ...baseHttpRequest,
                            body: {
                                ...baseHttpRequest.body,
                                amount: amount as number,
                            },
                            headers: { userId: baseHttpRequest.headers.userId },
                        })

                        expect(response.statusCode).toBe(400)
                        expect(response.body?.message).toBe(expectedMessage)
                    },
                )
            })

            it('should return 400 if body has unrecognized keys', async () => {
                const response = await sut.execute({
                    ...baseHttpRequest,
                    body: {
                        ...baseHttpRequest.body,
                        unexpected: 'value' as string,
                    } as UpdateTransactionParams,
                    headers: { userId: baseHttpRequest.headers.userId },
                })

                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toEqual(
                    expect.stringContaining('Unrecognized key: \"unexpected\"'),
                )
                expect(response.body?.message).toEqual(
                    expect.stringContaining('unexpected'),
                )
            })
        })
    })

    describe('success cases', () => {
        it('should return 200 when updating transaction successfully', async () => {
            // act
            const response = await sut.execute(baseHttpRequest)

            const data = response.body?.data

            // assert
            expect(response.statusCode).toBe(200)
            expect(data).toMatchObject(updateTransactionControllerResponse)
        })

        it('should call UpdateTransactionService with correct params', async () => {
            const executeSpy = jest.spyOn(updateTransactionService, 'execute')

            await sut.execute(baseHttpRequest)

            expect(executeSpy).toHaveBeenCalledWith(
                baseHttpRequest.params.transactionId,
                {
                    ...baseHttpRequest.body,
                    userId: baseHttpRequest.headers.userId,
                },
            )
            // expect(executeSpy).toHaveBeenCalledTimes(1)
        })
    })
})
