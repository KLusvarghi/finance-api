import request from 'supertest'

import { app } from '../app'
import { ResponseMessage, ResponseZodMessages } from '../shared'

import { createUserParams, updateUserParams } from '@/test'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

// Ao invpes de chamar a rota, poderiamos chamar direto o Prisma, mas dessa forma chamando nossas rotas, conseguimos testar o fluxo completo, desde a requisição até a resposta

describe('User Routes E2E Tests', () => {
    const from = '2025-08-01'
    const to = '2025-08-08'
    describe('GET /api/users/me', () => {
        it('should return 200 when user is found', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)
                .expect(201)

            const { body: responseBody } = await request(app)
                .get(`/api/users/me`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .expect(200)

            expect(responseBody.data.id).toEqual(createdUser.data.id)
            expect(responseBody.message).toBe(ResponseMessage.SUCCESS)
        })
    })

    describe('GET /api/users/me/balance', () => {
        it('should return 200 when user balance is found', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)
                .expect(201)

            await request(app)
                .post(`/api/transactions/me`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .send({
                    name: faker.lorem.words(3),
                    date: new Date(from),
                    amount: 10000,
                    type: TransactionType.EARNING,
                })

            await request(app)
                .post(`/api/transactions/me`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .send({
                    name: faker.lorem.words(3),
                    date: new Date(from),
                    amount: 2000,
                    type: TransactionType.INVESTMENT,
                })

            await request(app)
                .post(`/api/transactions/me`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .send({
                    name: faker.lorem.words(3),
                    date: new Date(to),
                    amount: 2000,
                    type: TransactionType.EXPENSE,
                })

            const { body: responseBody } = await request(app)
                .get(`/api/users/me/balance`)
                .query({ from, to })
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .expect(200)

            expect(responseBody.data).toStrictEqual({
                earnings: '10000',
                expenses: '2000',
                investments: '2000',
                balance: '6000',
                earningsPercentage: 71,
                expensesPercentage: 14,
                investmentsPercentage: 14,
            })
            expect(responseBody.message).toBe(ResponseMessage.SUCCESS)
        })
    })

    describe('POST /api/users', () => {
        it('should return 201 when user is created', async () => {
            const { body: responseBody } = await request(app)
                .post('/api/users')
                .send(createUserParams)
                .expect(201)

            expect(responseBody.data.tokens.accessToken).toBeDefined()
            expect(responseBody.data.tokens.refreshToken).toBeDefined()
            expect(responseBody.message).toBe(ResponseMessage.USER_CREATED)
        })

        it('should return 400 when Email already exists', async () => {
            const { body: user1 } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)
                .expect(201)

            const { body: responseBody } = await request(app)
                .post(`/api/users`)
                .send({ ...createUserParams, email: user1.data.email })
                .expect(400)

            expect(responseBody.message).toBe(
                `The e-mail ${user1.data.email} is already in use`,
            )
        })

        it('should return 400 when password is not strong enough', async () => {
            const { body: responseBody } = await request(app)
                .post(`/api/users`)
                .send({ ...createUserParams, password: '123' })
                .expect(400)

            expect(responseBody.message).toBe(
                ResponseZodMessages.password.minLength,
            )
        })
    })

    describe('POST /api/users/login', () => {
        it('should return 200 and tokens when user is logged in', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)

            const { body: responseBody } = await request(app)
                .post(`/api/users/login`)
                .send({
                    email: createdUser.data.email,
                    password: createUserParams.password,
                })
                .expect(200)

            expect(responseBody.message).toBe(
                ResponseMessage.USER_LOGIN_SUCCESS,
            )
            expect(responseBody?.data?.tokens?.accessToken).toBeDefined()
            expect(responseBody?.data?.tokens?.refreshToken).toBeDefined()
        })
    })

    describe('PATCH /api/users/me', () => {
        it('should return 200 when user is updated', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)
                .expect(201)

            const { body: responseBody } = await request(app)
                .patch(`/api/users/me`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .send(updateUserParams)
                .expect(200)

            expect(responseBody.data.id).toEqual(createdUser.data.id)
            expect(responseBody.data).not.toHaveProperty('password')
            expect(responseBody.message).toBe(ResponseMessage.USER_UPDATED)
        })
    })

    describe('DELETE /api/users/me', () => {
        it('should return 200 when user is deleted', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)
                .expect(201)

            const { body: responseBody } = await request(app)
                .delete(`/api/users/me`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .expect(200)

            expect(responseBody.message).toBe(ResponseMessage.USER_DELETED)
        })
    })

    describe('POST /api/refresh-token', () => {
        it('should return 201 and new tokens when token is valid', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)
                .expect(201)

            const { body: responseBody } = await request(app)
                .post(`/api/users/refresh-token`)
                .send({
                    refreshToken: createdUser.data.tokens.refreshToken,
                })
                .expect(201)
            expect(responseBody.message).toBe(ResponseMessage.TOKEN_REFRESHED)
            expect(responseBody?.data?.accessToken).toBeDefined()
            expect(responseBody?.data?.refreshToken).toBeDefined()
        })
    })
})
