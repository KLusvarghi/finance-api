import request from 'supertest'

import { prisma } from '../../prisma/prisma'
import { app } from '../app'

import { ResponseMessage, ResponseZodMessages } from '@/shared'
import {
    createTransactionParams,
    makeTransaction,
    makeUser,
    transactionId,
    updateTransactionParams,
} from '@/test'
import {
    createInvalidIdCases,
    createInvalidNameCases,
    invalidAmountCases,
    invalidDateCases,
    invalidTypeCases,
} from '@/test'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

describe('Transactions Routes E2E Tests', () => {
    describe('GET /api/transactions/me', () => {
        it('should return 401 if authorization header is missing', async () => {
            const { body: responseBody } = await request(app)
                .get('/api/transactions/me')
                .query({ from: '2025-08-01', to: '2025-08-08' })
                .expect(401)

            expect(responseBody.message).toBe('Unauthorized')
        })

        it('should return 401 if token is invalid', async () => {
            const { body: responseBody } = await request(app)
                .get('/api/transactions/me')
                .query({ from: '2025-08-01', to: '2025-08-08' })
                .set('authorization', 'Bearer invalid-token')
                .expect(401)

            expect(responseBody.message).toBe('Unauthorized')
        })

        it('should return 200 with paginated response when transaction is found', async () => {
            const { user, transaction } = await makeTransaction()

            const from = new Date(transaction.date).toISOString().split('T')[0]
            const to = new Date(transaction.date).toISOString().split('T')[0]

            const { body: responseBody } = await request(app)
                .get(`/api/transactions/me`)
                .query({ from, to })
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .expect(200)

            expect(responseBody.success).toBe(true)
            expect(responseBody.data).toHaveProperty('transactions')
            expect(responseBody.data).toHaveProperty('nextCursor')
            expect(responseBody.data.transactions.length).toBe(1)
            expect(responseBody.data.transactions[0].id).toBe(transaction.id)
            expect(responseBody.data.transactions[0].userId).toBe(user.id)
            expect(responseBody.data.nextCursor).toBeNull()
            expect(responseBody.message).toBe(ResponseMessage.SUCCESS)
        })

        it('should handle pagination with custom limit', async () => {
            // Create user first without transaction
            const user = await makeUser()

            // Use a specific date to ensure all transactions fall within the query range
            const testDate = new Date()
            const from = testDate.toISOString().split('T')[0]
            const to = testDate.toISOString().split('T')[0]

            // Create exactly 10 transactions for the same user
            const transactions = []
            for (let i = 0; i < 10; i++) {
                const transaction = await prisma.transaction.create({
                    data: {
                        id: faker.string.uuid(),
                        userId: user.id,
                        name: faker.lorem.words(3),
                        amount: faker.number.int({ min: 1, max: 1000 }),
                        date: testDate, // Use the same date to ensure it's within range
                        type: faker.helpers.arrayElement([
                            'EARNING',
                            'EXPENSE',
                            'INVESTMENT',
                        ]),
                    },
                })
                transactions.push(transaction)
            }

            const { body: responseBody } = await request(app)
                .get(`/api/transactions/me`)
                .query({ from, to, limit: 5 })
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .expect(200)

            expect(responseBody.success).toBe(true)
            expect(responseBody.data.transactions.length).toBe(5)
            expect(responseBody.data).toHaveProperty('nextCursor')
            expect(responseBody.data.nextCursor).not.toBeNull() // Should have more pages
        })

        it('should handle cursor-based pagination for multiple pages', async () => {
            // Create user first without transaction
            const user = await makeUser()

            // Use a specific date to ensure all transactions fall within the query range
            const testDate = new Date()
            const from = testDate.toISOString().split('T')[0]
            const to = testDate.toISOString().split('T')[0]

            // Create exactly 25 transactions for the same user
            const transactions = []
            for (let i = 0; i < 25; i++) {
                const transaction = await prisma.transaction.create({
                    data: {
                        id: faker.string.uuid(),
                        userId: user.id,
                        name: faker.lorem.words(3),
                        amount: faker.number.int({ min: 1, max: 1000 }),
                        date: testDate, // Use the same date to ensure it's within range
                        type: faker.helpers.arrayElement([
                            'EARNING',
                            'EXPENSE',
                            'INVESTMENT',
                        ]),
                    },
                })
                transactions.push(transaction)
            }

            // First page
            const { body: firstPageResponse } = await request(app)
                .get(`/api/transactions/me`)
                .query({ from, to })
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .expect(200)

            expect(firstPageResponse.success).toBe(true)
            expect(firstPageResponse.data.transactions.length).toBe(20)
            expect(firstPageResponse.data.nextCursor).not.toBeNull()

            // Second page using cursor
            const { body: secondPageResponse } = await request(app)
                .get(`/api/transactions/me`)
                .query({ from, to, cursor: firstPageResponse.data.nextCursor })
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .expect(200)

            expect(secondPageResponse.success).toBe(true)
            expect(secondPageResponse.data.transactions.length).toBe(5)
            expect(secondPageResponse.data.nextCursor).toBeNull()
        })

        it('should return 200 with empty paginated response when no transactions are found', async () => {
            const user = await makeUser()

            const { body: responseBody } = await request(app)
                .get(`/api/transactions/me`)
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .expect(200)

            expect(responseBody.success).toBe(true)
            expect(responseBody.data).toHaveProperty('transactions')
            expect(responseBody.data).toHaveProperty('nextCursor')
            expect(responseBody.data.transactions.length).toBe(0)
            expect(responseBody.data.nextCursor).toBeNull()
            expect(responseBody.message).toBe(ResponseMessage.SUCCESS)
        })

        describe('Filtering', () => {
            let user: Awaited<ReturnType<typeof makeUser>>
            let transactions: Awaited<
                ReturnType<typeof prisma.transaction.create>
            >[] = []

            beforeEach(async () => {
                user = await makeUser()
                // Create a diverse set of transactions
                transactions = await Promise.all([
                    prisma.transaction.create({
                        data: {
                            userId: user.id,
                            name: 'Salário mensal',
                            type: 'EARNING',
                            date: new Date('2025-09-05'),
                            amount: 5000,
                        },
                    }),
                    prisma.transaction.create({
                        data: {
                            userId: user.id,
                            name: 'Aluguel',
                            type: 'EXPENSE',
                            date: new Date('2025-09-05'),
                            amount: 1500,
                        },
                    }),
                    prisma.transaction.create({
                        data: {
                            userId: user.id,
                            name: 'Supermercado',
                            type: 'EXPENSE',
                            date: new Date('2025-09-10'),
                            amount: 400,
                        },
                    }),
                    prisma.transaction.create({
                        data: {
                            userId: user.id,
                            name: 'Ações da Firma',
                            type: 'INVESTMENT',
                            date: new Date('2025-09-12'),
                            amount: 1000,
                        },
                    }),
                    prisma.transaction.create({
                        data: {
                            userId: user.id,
                            name: 'Cinema',
                            type: 'EXPENSE',
                            date: new Date('2025-09-15'),
                            amount: 50,
                        },
                    }),
                ])
            })

            it('should filter by type', async () => {
                const { body: responseBody } = await request(app)
                    .get('/api/transactions/me')
                    .query({ type: 'EXPENSE' })
                    .set('authorization', `Bearer ${user.tokens.accessToken}`)
                    .expect(200)

                expect(responseBody.data.transactions.length).toBe(3)
                expect(
                    responseBody.data.transactions.every(
                        (t: { type: string }) => t.type === 'EXPENSE',
                    ),
                ).toBe(true)
            })

            it('should filter by title (case-insensitive)', async () => {
                const { body: responseBody } = await request(app)
                    .get('/api/transactions/me')
                    .query({ title: 'salár' })
                    .set('authorization', `Bearer ${user.tokens.accessToken}`)
                    .expect(200)

                expect(responseBody.data.transactions.length).toBe(1)
                expect(responseBody.data.transactions[0].name).toBe(
                    'Salário mensal',
                )
            })

            it('should filter by from date', async () => {
                const { body: responseBody } = await request(app)
                    .get('/api/transactions/me')
                    .query({ from: '2025-09-10' })
                    .set('authorization', `Bearer ${user.tokens.accessToken}`)
                    .expect(200)

                expect(responseBody.data.transactions.length).toBe(3)
            })

            it('should filter by to date', async () => {
                const { body: responseBody } = await request(app)
                    .get('/api/transactions/me')
                    .query({ to: '2025-09-05' })
                    .set('authorization', `Bearer ${user.tokens.accessToken}`)
                    .expect(200)

                expect(responseBody.data.transactions.length).toBe(2)
            })

            it('should filter by date range', async () => {
                const { body: responseBody } = await request(app)
                    .get('/api/transactions/me')
                    .query({ from: '2025-09-01', to: '2025-09-11' })
                    .set('authorization', `Bearer ${user.tokens.accessToken}`)
                    .expect(200)

                expect(responseBody.data.transactions.length).toBe(3)
            })

            it('should combine filters (type and from date)', async () => {
                const { body: responseBody } = await request(app)
                    .get('/api/transactions/me')
                    .query({ type: 'EXPENSE', from: '2025-09-06' })
                    .set('authorization', `Bearer ${user.tokens.accessToken}`)
                    .expect(200)

                expect(responseBody.data.transactions.length).toBe(2)
                expect(responseBody.data.transactions[0].name).toBe('Cinema')
                expect(responseBody.data.transactions[1].name).toBe(
                    'Supermercado',
                )
            })
        })
    })

    describe('POST /api/transactions/me', () => {
        it('should return 401 if authorization header is missing', async () => {
            const { body: responseBody } = await request(app)
                .post('/api/transactions/me')
                .send(createTransactionParams)
                .expect(401)

            expect(responseBody.message).toBe('Unauthorized')
        })

        it('should return 401 if token is invalid', async () => {
            const { body: responseBody } = await request(app)
                .post('/api/transactions/me')
                .set('authorization', 'Bearer invalid-token')
                .send(createTransactionParams)
                .expect(401)

            expect(responseBody.message).toBe('Unauthorized')
        })

        describe('validation', () => {
            const invalidNameCases = createInvalidNameCases({
                required: ResponseZodMessages.name.required,
                minLength: ResponseZodMessages.name.minLength,
            })

            it.each(invalidNameCases)(
                'should return 400 if name is $description',
                async ({ name, expectedMessage }) => {
                    const user = await makeUser()

                    const { body: responseBody } = await request(app)
                        .post('/api/transactions/me')
                        .set(
                            'authorization',
                            `Bearer ${user.tokens.accessToken}`,
                        )
                        .send({ ...createTransactionParams, name })
                        .expect(400)

                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )

            it.each(invalidDateCases)(
                'should return 400 if date is $description',
                async ({ date, expectedMessage }) => {
                    const user = await makeUser()

                    const { body: responseBody } = await request(app)
                        .post('/api/transactions/me')
                        .set(
                            'authorization',
                            `Bearer ${user.tokens.accessToken}`,
                        )
                        .send({ ...createTransactionParams, date })
                        .expect(400)

                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )

            it.each(invalidTypeCases)(
                'should return 400 if type is $description',
                async ({ type, expectedMessage }) => {
                    const user = await makeUser()

                    const { body: responseBody } = await request(app)
                        .post('/api/transactions/me')
                        .set(
                            'authorization',
                            `Bearer ${user.tokens.accessToken}`,
                        )
                        .send({ ...createTransactionParams, type })
                        .expect(400)

                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )

            it.each(invalidAmountCases)(
                'should return 400 if amount is $description',
                async ({ amount, expectedMessage }) => {
                    const user = await makeUser()

                    const { body: responseBody } = await request(app)
                        .post('/api/transactions/me')
                        .set(
                            'authorization',
                            `Bearer ${user.tokens.accessToken}`,
                        )
                        .send({ ...createTransactionParams, amount })
                        .expect(400)

                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )
        })

        it('should return 201 when transaction is created successfully', async () => {
            const user = await makeUser()

            const { body: createdTransaction } = await request(app)
                .post('/api/transactions/me')
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .send({
                    ...createTransactionParams,
                    amount: 1000,
                    type: TransactionType.EARNING,
                })
                .expect(201)

            expect(createdTransaction.success).toBe(true)
            expect(createdTransaction.data.userId).toBe(user.id)
            expect(createdTransaction.data.amount).toBe('1000')
            expect(createdTransaction.data.type).toBe(TransactionType.EARNING)
        })
    })

    describe('PATCH /api/transactions/me/:transactionId', () => {
        it('should return 401 if authorization header is missing', async () => {
            const { body: responseBody } = await request(app)
                .patch('/api/transactions/me/some-transaction-id')
                .send(updateTransactionParams)
                .expect(401)

            expect(responseBody.message).toBe('Unauthorized')
        })

        it('should return 401 if token is invalid', async () => {
            const { body: responseBody } = await request(app)
                .patch('/api/transactions/me/some-transaction-id')
                .set('authorization', 'Bearer invalid-token')
                .send(updateTransactionParams)
                .expect(401)

            expect(responseBody.message).toBe('Unauthorized')
        })

        describe('validation', () => {
            const invalidIdCases = createInvalidIdCases({
                missing: ResponseMessage.TRANSACTION_ID_MISSING,
                invalid: ResponseMessage.TRANSACTION_INVALID_ID,
            })

            it.each(invalidIdCases)(
                'should return 400 if transactionId is $description',
                async ({ id, expectedMessage }) => {
                    const user = await makeUser()

                    const { body: responseBody } = await request(app)
                        .patch(`/api/transactions/me/${id}`)
                        .set(
                            'authorization',
                            `Bearer ${user.tokens.accessToken}`,
                        )
                        .send(updateTransactionParams)
                        .expect(400)

                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )

            it('should return 400 if name is too short', async () => {
                const { user, transaction } = await makeTransaction()

                const { body: responseBody } = await request(app)
                    .patch(`/api/transactions/me/${transaction.id}`)
                    .set('authorization', `Bearer ${user.tokens.accessToken}`)
                    .send({ name: 'A' })
                    .expect(400)

                expect(responseBody.success).toBe(false)
                expect(responseBody.message).toBe(
                    ResponseZodMessages.name.minLength,
                )
            })

            it('should return 400 if name is too long', async () => {
                const { user, transaction } = await makeTransaction()

                const { body: responseBody } = await request(app)
                    .patch(`/api/transactions/me/${transaction.id}`)
                    .set('authorization', `Bearer ${user.tokens.accessToken}`)
                    .send({ name: 'A'.repeat(101) })
                    .expect(400)

                expect(responseBody.success).toBe(false)
                expect(responseBody.message).toBe(
                    ResponseZodMessages.name.maxLength,
                )
            })

            it.each(invalidDateCases)(
                'should return 400 if date is $description',
                async ({ date, expectedMessage }) => {
                    const { user, transaction } = await makeTransaction()

                    const { body: responseBody } = await request(app)
                        .patch(`/api/transactions/me/${transaction.id}`)
                        .set(
                            'authorization',
                            `Bearer ${user.tokens.accessToken}`,
                        )
                        .send({ date })
                        .expect(400)

                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )

            it.each(invalidTypeCases)(
                'should return 400 if type is $description',
                async ({ type, expectedMessage }) => {
                    const { user, transaction } = await makeTransaction()

                    const { body: responseBody } = await request(app)
                        .patch(`/api/transactions/me/${transaction.id}`)
                        .set(
                            'authorization',
                            `Bearer ${user.tokens.accessToken}`,
                        )
                        .send({ type })
                        .expect(400)

                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )

            it.each(invalidAmountCases)(
                'should return 400 if amount is $description',
                async ({ amount, expectedMessage }) => {
                    const { user, transaction } = await makeTransaction()

                    const { body: responseBody } = await request(app)
                        .patch(`/api/transactions/me/${transaction.id}`)
                        .set(
                            'authorization',
                            `Bearer ${user.tokens.accessToken}`,
                        )
                        .send({ amount })
                        .expect(400)

                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )

            it('should return 400 if body has unrecognized keys', async () => {
                const { user, transaction } = await makeTransaction()

                const { body: responseBody } = await request(app)
                    .patch(`/api/transactions/me/${transaction.id}`)
                    .set('authorization', `Bearer ${user.tokens.accessToken}`)
                    .send({
                        name: 'Valid Name',
                        unexpected: 'value',
                    })
                    .expect(400)

                expect(responseBody.success).toBe(false)
                expect(responseBody.message).toContain(
                    'Field \"unexpected\" is not allowed in this request',
                )
                expect(responseBody.message).toContain('unexpected')
            })
        })

        it('should return 200 when transaction is updated successfully', async () => {
            const { user, transaction } = await makeTransaction({
                amount: 1000,
                type: TransactionType.EARNING,
            })

            const { body: responseBody } = await request(app)
                .patch(`/api/transactions/me/${transaction.id}`)
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .send(updateTransactionParams)
                .expect(200)

            expect(responseBody.success).toBe(true)
            expect(responseBody.data).not.toBeNull()
            expect(responseBody.message).toBe(
                ResponseMessage.TRANSACTION_UPDATED,
            )
        })

        it('should return 404 when transaction is not found', async () => {
            const user = await makeUser()

            const { body: responseBody } = await request(app)
                .patch(`/api/transactions/me/${transactionId}`)
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .send(updateTransactionParams)
                .expect(404)

            expect(responseBody.success).toBe(false)
            expect(responseBody.message).toBe(
                `Transaction with id ${transactionId} not found`,
            )
        })
    })

    describe('DELETE /api/transactions/me/:transactionId', () => {
        it('should return 401 if authorization header is missing', async () => {
            const { body: responseBody } = await request(app)
                .delete('/api/transactions/me/some-transaction-id')
                .expect(401)

            expect(responseBody.message).toBe('Unauthorized')
        })

        it('should return 401 if token is invalid', async () => {
            const { body: responseBody } = await request(app)
                .delete('/api/transactions/me/some-transaction-id')
                .set('authorization', 'Bearer invalid-token')
                .expect(401)

            expect(responseBody.message).toBe('Unauthorized')
        })

        describe('validation', () => {
            const invalidIdCases = createInvalidIdCases({
                missing: ResponseMessage.TRANSACTION_ID_MISSING,
                invalid: ResponseMessage.TRANSACTION_INVALID_ID,
            })

            it.each(invalidIdCases)(
                'should return 400 if transactionId is $description',
                async ({ id, expectedMessage }) => {
                    const user = await makeUser()

                    const { body: responseBody } = await request(app)
                        .delete(`/api/transactions/me/${id || ''}`)
                        .set(
                            'authorization',
                            `Bearer ${user.tokens.accessToken}`,
                        )
                        .expect(400)

                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )
        })

        it('should return 200 when transaction is deleted successfully', async () => {
            const { user, transaction } = await makeTransaction()

            const { body: deletedTransaction } = await request(app)
                .delete(`/api/transactions/me/${transaction.id}`)
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .expect(200)

            expect(deletedTransaction.success).toBe(true)
            expect(deletedTransaction.data).not.toBeNull()
            expect(deletedTransaction.message).toBe(
                ResponseMessage.TRANSACTION_DELETED,
            )
        })

        it('should return 404 when transaction is not found', async () => {
            const user = await makeUser()

            const { body: responseBody } = await request(app)
                .delete(`/api/transactions/me/${transactionId}`)
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .expect(404)

            expect(responseBody.success).toBe(false)
            expect(responseBody.message).toBe(
                `Transaction with id ${transactionId} not found`,
            )
        })
    })
})
