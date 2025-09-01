import request from 'supertest'

import { app } from '../app'

import { ResponseMessage } from '@/shared'
import {
    createTransactionParams,
    createUserParams,
    transactionId,
    updateTransactionParams,
} from '@/test'
import { TransactionType } from '@prisma/client'

describe('Transactions Routes E2E Tests', () => {
    describe('GET /api/transactions/me', () => {
        it('should return 200 when transaction is found', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)

            const { body: createdTransaction } = await request(app)
                .post('/api/transactions/me')
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .send({
                    ...createTransactionParams,
                    userId: createdUser.data.id,
                })
                .expect(201)

            const { body: responseBody } = await request(app)
                .get(`/api/transactions/me`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .expect(200)

            expect(responseBody.data.length).toBe(1)
            expect(responseBody.data[0]).toStrictEqual(createdTransaction.data)
            expect(responseBody.message).toBe(ResponseMessage.SUCCESS)
        })

        it('should return 404 when transaction is not found', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)

            const { body: responseBody } = await request(app)
                .get(`/api/transactions/me`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .expect(200)

            expect(responseBody.data.length).toBe(0)
            expect(responseBody.message).toBe(ResponseMessage.SUCCESS)
        })
    })

    describe('POST /api/transactions', () => {
        it('should return 201 when transaction is created successfully', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)

            const { body: createdTransaction } = await request(app)
                .post('/api/transactions/me')
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .send({
                    ...createTransactionParams,
                    userId: createdUser.data.id,
                    amount: 1000,
                    type: TransactionType.EARNING,
                })
                .expect(201)

            expect(createdTransaction.data.userId).toBe(createdUser.data.id)
            expect(createdTransaction.data.amount).toBe('1000')
            expect(createdTransaction.data.type).toBe(TransactionType.EARNING)
        })
    })

    describe('PATCH /api/transactions/:transactionId', () => {
        it('should return 200 when transaction is updated successfully', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)

            const { body: createdTransaction } = await request(app)
                .post('/api/transactions/me')
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .send({
                    ...createTransactionParams,
                    userId: createdUser.data.id,
                    amount: 1000,
                    type: TransactionType.EARNING,
                })

            const { body: responseBody } = await request(app)
                .patch(`/api/transactions/${createdTransaction.data.id}`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .send(updateTransactionParams)
                .expect(200)

            expect(responseBody.data).not.toBeNull()
            expect(responseBody.message).toBe(
                ResponseMessage.TRANSACTION_UPDATED,
            )
        })

        it('should return 404 when transaction is not found', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)

            const { body: responseBody } = await request(app)
                .patch(`/api/transactions/${transactionId}`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .send(updateTransactionParams)
                .expect(404)

            expect(responseBody.data).toBeNull()
            expect(responseBody.message).toBe(
                `Transaction with id ${transactionId} not found`,
            )
        })
    })

    describe('DELETE /api/transactions/:transactionId', () => {
        it('should return 200 when transaction is deleted successfully', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)

            const { body: createdTransaction } = await request(app)
                .post('/api/transactions/me')
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .send({
                    ...createTransactionParams,
                    userId: createdUser.data.id,
                })
            const { body: deletedTransaction } = await request(app)
                .delete(`/api/transactions/${createdTransaction.data.id}`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .expect(200)

            expect(deletedTransaction.data).not.toBeNull()
            expect(deletedTransaction.message).toBe(
                ResponseMessage.TRANSACTION_DELETED,
            )
        })

        it('should return 404 when transaction is not found', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)

            const { body: responseBody } = await request(app)
                .delete(`/api/transactions/${transactionId}`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .expect(404)

            expect(responseBody.data).toBeNull()
            expect(responseBody.message).toBe(
                `Transaction with id ${transactionId} not found`,
            )
        })
    })
})
