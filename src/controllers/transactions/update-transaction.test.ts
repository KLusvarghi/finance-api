import {
    TransactionRepositoryResponse,
    UpdateTransactionParams,
} from '@/shared'
import { UpdateTransactionController } from './update-transaction'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import {
    invalidUUID,
    invalidDate,
    invalidType,
    invalidAmount,
} from '@/test/fixtures'

describe('UpdateTransactionController', () => {
    let sut: UpdateTransactionController
    let updateTransactionService: UpdateTransactionServiceStub
    let validTransactionId: string
    let validUpdateData: UpdateTransactionParams
    let validUpdateResponse: TransactionRepositoryResponse

    class UpdateTransactionServiceStub {
        execute(
            transactionId: string,
            _params: UpdateTransactionParams,
        ): Promise<TransactionRepositoryResponse> {
            return Promise.resolve({
                id: transactionId,
                user_id: faker.string.uuid(),
                name: faker.commerce.productName(),
                amount: new Prisma.Decimal(Number(faker.finance.amount())),
                date: faker.date.anytime(),
                type: 'EARNING',
            })
        }
    }

    const makeSut = () => {
        const updateTransactionService = new UpdateTransactionServiceStub()
        const sut = new UpdateTransactionController(updateTransactionService)

        return { sut, updateTransactionService }
    }

    beforeEach(() => {
        validTransactionId = faker.string.uuid()
        validUpdateData = {
            name: faker.commerce.productName(),
            amount: Number(faker.finance.amount()),
            date: faker.date.anytime().toISOString(),
            type: 'EARNING',
        }
        validUpdateResponse = {
            id: validTransactionId,
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            amount: new Prisma.Decimal(Number(faker.finance.amount())),
            date: faker.date.anytime(),
            type: 'EARNING',
        }

        const { sut: controller, updateTransactionService: service } = makeSut()
        sut = controller
        updateTransactionService = service
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('success cases', () => {
        it('should return 200 when updating transaction successfully', async () => {
            // act
            const response = await sut.execute({
                params: { transactionId: validTransactionId },
                body: validUpdateData,
            })

            const data = response.body?.data

            // assert
            expect(response.statusCode).toBe(200)
            expect(data).toMatchObject({
                id: validTransactionId,
                type: 'EARNING',
            })

            // Verificar se campos dinâmicos existem e têm tipos corretos
            expect(typeof data?.name).toBe('string')
            expect(data?.amount).toBeDefined()
            expect(data?.date).toBeInstanceOf(Date)
            expect(typeof data?.user_id).toBe('string')
        })
    })
    describe('validations', () => {
        it('should return 400 when transactionId is not provided', async () => {
            // act
            const response = await sut.execute({
                params: { transactionId: undefined },
                body: validUpdateData,
            })

            // assert
            expect(response.statusCode).toBe(400)
            expect(response.body?.message).toBe(
                'The field transactionId is required.',
            )
        })

        it.each(invalidUUID)(
            'should return 400 if trnasactionId is $description',
            async ({ id }) => {
                // act
                const response = await sut.execute({
                    params: { transactionId: id },
                    body: validUpdateData,
                })

                // assert
                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBe(
                    'The provider id is not valid.',
                )
            },
        )

        describe('validations', () => {
            it('should accept empty body (no fields provided)', async () => {
                const spy = jest.spyOn(updateTransactionService, 'execute')

                const response = await sut.execute({
                    params: { transactionId: validTransactionId },
                    body: {},
                })

                expect(response.statusCode).toBe(200)
                expect(spy).toHaveBeenCalledWith(validTransactionId, {})
            })

            describe('name', () => {
                it('should return 400 if name is too short', async () => {
                    const response = await sut.execute({
                        params: { transactionId: validTransactionId },
                        body: { ...validUpdateData, name: 'A' },
                    })

                    expect(response.statusCode).toBe(400)
                    expect(response.body?.status).toBe('error')
                    expect(response.body?.message).toBe(
                        'Name must be at least 3 characters long',
                    )
                })

                it('should return 400 if name is too long', async () => {
                    const response = await sut.execute({
                        params: { transactionId: validTransactionId },
                        body: { ...validUpdateData, name: 'A'.repeat(101) },
                    })

                    expect(response.statusCode).toBe(400)
                    expect(response.body?.status).toBe('error')
                    expect(response.body?.message).toBe(
                        'Name must be at most 100 characters long',
                    )
                })
            })

            describe('date', () => {
                it.each(invalidDate)(
                    'should return 400 if date is $description',
                    async ({ date }) => {
                        const response = await sut.execute({
                            params: { transactionId: validTransactionId },
                            body: { ...validUpdateData, date },
                        })

                        expect(response.statusCode).toBe(400)
                        expect(response.body?.status).toBe('error')
                        expect(response.body?.message).toBe(
                            'Date must be a valid date',
                        )
                    },
                )
            })

            describe('type', () => {
                it.each(invalidType)(
                    'should return 400 if type is $description',
                    async ({ type }) => {
                        const response = await sut.execute({
                            params: { transactionId: validTransactionId },
                            body: { ...validUpdateData, type },
                        })

                        expect(response.statusCode).toBe(400)
                        expect(response.body?.status).toBe('error')
                        expect(response.body?.message).toBe(
                            'Type must be EARNING, EXPENSE or INVESTMENT',
                        )
                    },
                )
            })

            describe('amount', () => {
                it.each(invalidAmount)(
                    'should return 400 if amount is $description',
                    async ({ amount }) => {
                        const response = await sut.execute({
                            params: { transactionId: validTransactionId },
                            body: { ...validUpdateData, amount },
                        })

                        expect(response.statusCode).toBe(400)
                        expect(response.body?.status).toBe('error')
                        // expect(response.body?.message).toBe('Amount is required')
                        // expect(response.body?.message).toBe('Amount must be a valid currency (2 decimal places)')
                    },
                )

                it('should return 400 if amount too small', async () => {
                    const response = await sut.execute({
                        params: { transactionId: validTransactionId },
                        body: { ...validUpdateData, amount: 0 },
                    })

                    expect(response.statusCode).toBe(400)
                    expect(response.body?.message).toBe(
                        'Amount must be greater than 0',
                    )
                })
            })

            it('should return 400 if body has unrecognized keys', async () => {
                const response = await sut.execute({
                    params: { transactionId: validTransactionId },
                    body: { ...validUpdateData, unexpected: 'value' },
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

        describe('error handling', () => {
            it('should return 500 if UpdateTransactionService throws generic error', async () => {
                jest.spyOn(
                    updateTransactionService,
                    'execute',
                ).mockRejectedValueOnce(new Error())

                const result = await sut.execute({
                    params: { transactionId: validTransactionId },
                    body: validUpdateData,
                })

                expect(result.statusCode).toBe(500)
                expect(result.body?.status).toBe('error')
            })
        })
    })
})
