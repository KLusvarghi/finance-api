import { CreateTransactionController } from '@/controllers'
import {
    CreateTransactionParams,
    ResponseZodMessages,
    TransactionPublicResponse,
} from '@/shared'
import {
    createInvalidNameCases,
    createTransactionControllerResponse,
    createTransactionHttpRequest as baseHttpRequest,
    createTransactionParams as params,
    invalidAmountCases,
    invalidDateCases,
    invalidTypeCases,
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
        describe('name', () => {
            const invalidNameCases = createInvalidNameCases({
                required: ResponseZodMessages.name.required,
                minLength: ResponseZodMessages.name.minLength,
            })
            it.each(invalidNameCases)(
                'should return 400 if name is $description',
                async ({ name, expectedMessage }) => {
                    // arrange

                    const response = await sut.execute({
                        body: { ...params, name: name as string },
                        headers: { userId: baseHttpRequest.headers.userId },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(expectedMessage)
                },
            )
        })

        describe('date', () => {
            it.each(invalidDateCases)(
                'should return 400 if date is $description',
                async ({ date, expectedMessage }) => {
                    // arrange
                    const response = await sut.execute({
                        body: {
                            ...params,
                            date: date as string,
                        },
                        headers: { userId: baseHttpRequest.headers.userId },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(expectedMessage)
                },
            )
        })
        describe('type', () => {
            it.each(invalidTypeCases)(
                'should return 400 if type is $description',
                async ({ type, expectedMessage }) => {
                    // arrange
                    const response = await sut.execute({
                        body: {
                            ...params,
                            type: type,
                        } as CreateTransactionParams,
                        headers: { userId: baseHttpRequest.headers.userId },
                    })

                    // assert
                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(expectedMessage)
                },
            )
        })
        describe('amount', () => {
            it.each(invalidAmountCases)(
                'should return 400 if amount is $description',
                async ({ amount, expectedMessage }) => {
                    // arrange
                    const response = await sut.execute({
                        body: {
                            ...params,
                            amount: amount,
                        } as CreateTransactionParams,
                        headers: { userId: baseHttpRequest.headers.userId },
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
