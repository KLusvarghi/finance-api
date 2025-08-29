import request from 'supertest'

import { app } from '../app'
import { ResponseMessage, ResponseZodMessages } from '../shared'

import { createUserParams, updateUserParams } from '@/test'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

// Ao invpes de chamar a rota, poderiamos chamar direto o Prisma, mas dessa forma chamando nossas rotas, conseguimos testar o fluxo completo, desde a requisição até a resposta

describe('User Routes E2E Tests', () => {
    describe('GET /api/users/:id', () => {
        it('should return 200 when user is found', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)
                .expect(201)

            const { body: responseBody } = await request(app)
                .get(`/api/users/${createdUser.data.id}`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .expect(200)

            expect(responseBody.data.id).toEqual(createdUser.data.id)
            expect(responseBody.message).toBe(ResponseMessage.SUCCESS)
        })
    })

    describe('GET /api/users/:userId/balance', () => {
        it('should return 200 when user balance is found', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)
                .expect(201)

            const userData = createdUser.data

            await request(app)
                .post(`/api/transactions`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .send({
                    user_id: userData.id,
                    name: faker.lorem.words(3),
                    date: faker.date.recent().toISOString(),
                    amount: 10000,
                    type: TransactionType.EARNING,
                })

            await request(app)
                .post(`/api/transactions`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .send({
                    user_id: userData.id,
                    name: faker.lorem.words(3),
                    date: faker.date.recent().toISOString(),
                    amount: 2000,
                    type: TransactionType.INVESTMENT,
                })

            await request(app)
                .post(`/api/transactions`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .send({
                    user_id: userData.id,
                    name: faker.lorem.words(3),
                    date: faker.date.recent().toISOString(),
                    amount: 2000,
                    type: TransactionType.EXPENSE,
                })

            const { body: responseBody } = await request(app)
                .get(`/api/users/${userData.id}/balance`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .expect(200)

            expect(responseBody.data).toEqual({
                earnings: '10000',
                expenses: '2000',
                investments: '2000',
                balance: '6000',
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

    describe('PATCH /api/users/:userId', () => {
        it('should return 200 when user is updated', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)
                .expect(201)

            const { body: responseBody } = await request(app)
                .patch(`/api/users/${createdUser.data.id}`)
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

    describe('DELETE /api/users/:userId', () => {
        it('should return 200 when user is deleted', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)
                .expect(201)

            const { body: responseBody } = await request(app)
                .delete(`/api/users/${createdUser.data.id}`)
                .set(
                    'authorization',
                    `Bearer ${createdUser.data.tokens.accessToken}`,
                )
                .expect(200)

            expect(responseBody.message).toBe(ResponseMessage.USER_DELETED)
        })
    })
})
