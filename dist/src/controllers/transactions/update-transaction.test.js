import { UpdateTransactionController } from '@/controllers'
import { ResponseMessage, ResponseZodMessages } from '@/shared'
import {
    invalidAmountCases,
    invalidDateCases,
    invalidTypeCases,
    invalidIdCases,
    updateTransactionControllerResponse,
    updateTransactionHttpRequest as baseHttpRequest,
} from '@/test'
describe('UpdateTransactionController', () => {
    let sut
    let updateTransactionService
    class UpdateTransactionServiceStub {
        execute(_transactionId, _params) {
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
        it('should return 400 when transactionId is not provided', async () => {
            // act
            const response = await sut.execute({
                ...baseHttpRequest,
                params: {
                    transactionId: undefined,
                },
            })
            // assert
            expect(response.statusCode).toBe(400)
            expect(response.body?.message).toBe(
                ResponseMessage.TRANSACTION_ID_MISSING,
            )
        })
        it.each(invalidIdCases)(
            'should return 400 if trnasactionId is $description',
            async ({ id }) => {
                // act
                const response = await sut.execute({
                    ...baseHttpRequest,
                    params: {
                        transactionId: id,
                    },
                })
                // assert
                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBe(ResponseMessage.INVALID_ID)
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
                    {},
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
                it.each(invalidDateCases)(
                    'should return 400 if date is $description',
                    async ({ date }) => {
                        const response = await sut.execute({
                            ...baseHttpRequest,
                            body: {
                                ...baseHttpRequest.body,
                                date,
                            },
                        })
                        expect(response.statusCode).toBe(400)
                        expect(response.body?.message).toBe(
                            ResponseZodMessages.date.invalid,
                        )
                    },
                )
            })
            describe('type', () => {
                it.each(invalidTypeCases)(
                    'should return 400 if type is $description',
                    async ({ type }) => {
                        const response = await sut.execute({
                            ...baseHttpRequest,
                            body: {
                                ...baseHttpRequest.body,
                                type,
                            },
                        })
                        expect(response.statusCode).toBe(400)
                        expect(response.body?.message).toBe(
                            ResponseZodMessages.type.invalid,
                        )
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
                                amount,
                            },
                        })
                        expect(response.statusCode).toBe(400)
                        expect(response.body?.message).toBe(expectedMessage)
                    },
                )
                it('should return 400 if amount too small', async () => {
                    const response = await sut.execute({
                        ...baseHttpRequest,
                        body: {
                            ...baseHttpRequest.body,
                            amount: 0,
                        },
                    })
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(
                        ResponseZodMessages.amount.minValue,
                    )
                })
            })
            it('should return 400 if body has unrecognized keys', async () => {
                const response = await sut.execute({
                    ...baseHttpRequest,
                    body: {
                        ...baseHttpRequest.body,
                        unexpected: 'value',
                    },
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
                baseHttpRequest.body,
            )
            // expect(executeSpy).toHaveBeenCalledTimes(1)
        })
    })
})
//# sourceMappingURL=update-transaction.test.js.map
