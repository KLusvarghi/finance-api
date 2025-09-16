import request from 'supertest'

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

        it('should return 200 when transaction is found', async () => {
            const { user, transaction } = await makeTransaction()

            const from = new Date(transaction.date).toISOString().split('T')[0]
            const to = new Date(transaction.date).toISOString().split('T')[0]

            const { body: responseBody } = await request(app)
                .get(`/api/transactions/me`)
                .query({ from, to })
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .expect(200)

            expect(responseBody.success).toBe(true)
            expect(responseBody.data.length).toBe(1)
            expect(responseBody.data[0].id).toBe(transaction.id)
            expect(responseBody.data[0].userId).toBe(user.id)
            expect(responseBody.message).toBe(ResponseMessage.SUCCESS)
        })

        it('should return 404 when transaction is not found', async () => {
            const user = await makeUser()

            const from = '2025-01-01'
            const to = '2025-01-31'

            const { body: responseBody } = await request(app)
                .get(`/api/transactions/me`)
                .query({ from, to })
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .expect(200)

            expect(responseBody.success).toBe(true)
            expect(responseBody.data.length).toBe(0)
            expect(responseBody.message).toBe(ResponseMessage.SUCCESS)
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
