import request from 'supertest'

import { app } from '../app'
import { ResponseMessage } from '../shared'

import {
    createUserParams,
    updateUserParams,
    userId,
    userResponse,
} from '@/test'
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
                .expect(200)

            expect(responseBody.data).toEqual(createdUser.data)
            expect(responseBody.message).toBe(ResponseMessage.SUCCESS)
        })

        it('should return 404 when user is not found', async () => {
            const { body: responseBody } = await request(app)
                .get(`/api/users/${userId}`)
                .expect(404)

            expect(responseBody.message).toBe(
                `User with id ${userId} not found`,
            )
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
                .send({
                    user_id: userData.id,
                    name: faker.lorem.words(3),
                    date: faker.date.recent().toISOString(),
                    amount: 10000,
                    type: TransactionType.EARNING,
                })

            await request(app)
                .post(`/api/transactions`)
                .send({
                    user_id: userData.id,
                    name: faker.lorem.words(3),
                    date: faker.date.recent().toISOString(),
                    amount: 2000,
                    type: TransactionType.INVESTMENT,
                })

            await request(app)
                .post(`/api/transactions`)
                .send({
                    user_id: userData.id,
                    name: faker.lorem.words(3),
                    date: faker.date.recent().toISOString(),
                    amount: 2000,
                    type: TransactionType.EXPENSE,
                })

            const { body: responseBody } = await request(app)
                .get(`/api/users/${userData.id}/balance`)
                .expect(200)

            expect(responseBody.data).toEqual({
                earnings: '10000',
                expenses: '2000',
                investments: '2000',
                balance: '6000',
            })
            expect(responseBody.message).toBe(ResponseMessage.SUCCESS)
        })

        it('should return 404 when user is not found', async () => {
            const { body: responseBody } = await request(app)
                .get(`/api/users/${userId}/balance`)
                .expect(404)

            expect(responseBody.message).toBe(
                `User with id ${userId} not found`,
            )
        })
    })

    describe('POST /api/users', () => {
        it('should return 201 when user is created', async () => {
            const { body: responseBody } = await request(app)
                .post('/api/users')
                .send(createUserParams)
                .expect(201)

            expect(responseBody.data).toEqual({
                ...userResponse,
                id: expect.any(String),
            })
            expect(responseBody.message).toBe(ResponseMessage.USER_CREATED)
        })

        it('should return 400 when Email already exists', async () => {
            const { body: user1 } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)
                .expect(201) // was 400

            const { body: responseBody } = await request(app)
                .post(`/api/users`)
                .send({ ...createUserParams, email: user1.data.email })
                .expect(400)

            expect(responseBody.message).toBe(
                `The e-mail ${user1.data.email} is already in use`,
            )
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
                .send(updateUserParams)
                .expect(200)

            expect(responseBody.data).toEqual({
                ...createdUser.data,
                ...updateUserParams,
                password: undefined,
            })
            expect(responseBody.data).not.toHaveProperty('password')
            expect(responseBody.message).toBe(ResponseMessage.USER_UPDATED)
        })

        it('should return 404 when user is not found', async () => {
            const { body: responseBody } = await request(app)
                .patch(`/api/users/${userId}`)
                .send(updateUserParams)
                .expect(404)

            expect(responseBody.message).toBe(
                `User with id ${userId} not found`,
            )
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
                .expect(200)

            expect(responseBody.message).toBe(ResponseMessage.USER_DELETED)
        })

        it('should return 404 when user is not found', async () => {
            const { body: responseBody } = await request(app)
                .delete(`/api/users/${userId}`)
                .expect(404)

            expect(responseBody.message).toBe(
                `User with id ${userId} not found`,
            )
        })
    })
})
