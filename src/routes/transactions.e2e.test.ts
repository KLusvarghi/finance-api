import request from 'supertest'

import { app } from '../app'

import { ResponseMessage } from '@/shared'
import { createTransactionParams, createUserParams } from '@/test'
import { TransactionType } from '@prisma/client'

describe('Transactions Routes E2E Tests', () => {
    describe('GET /api/transactions/?userId', () => {
        it('should return 200 when transaction is found', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)

            const { body: createdTransaction } = await request(app)
                .post('/api/transactions')
                .send({
                    ...createTransactionParams,
                    user_id: createdUser.data.id,
                })
                .expect(201)

            const { body: responseBody } = await request(app)
                .get(`/api/transactions/?userId=${createdUser.data.id}`)
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
                .get(`/api/transactions/?userId=${createdUser.data.id}`)
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
                .post('/api/transactions')
                .send({
                    ...createTransactionParams,
                    user_id: createdUser.data.id,
                    amount: 1000,
                    type: TransactionType.EARNING,
                })
                .expect(201)

            expect(createdTransaction.data.user_id).toBe(createdUser.data.id)
            expect(createdTransaction.data.amount).toBe('1000')
            expect(createdTransaction.data.type).toBe(TransactionType.EARNING)
        })
    })
})
