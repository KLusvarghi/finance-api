import request from 'supertest'

import { app } from '../app'
import { ResponseMessage } from '../shared'

import { createUserParams, updateUserParams, userResponse } from '@/test'

// Ao invpes de chamar a rota, poderiamos chamar direto o Prisma, mas dessa forma chamando nossas rotas, conseguimos testar o fluxo completo, desde a requisição até a resposta

describe('User Routes E2E Tests', () => {
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
    })

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
    })

    describe('GET /api/users/:userId/balance', () => {
        it('should return 200 when user balance is found', async () => {
            const { body: createdUser } = await request(app)
                .post(`/api/users`)
                .send(createUserParams)
                .expect(201)

            const { body: responseBody } = await request(app)
                .get(`/api/users/${createdUser.data.id}/balance`)
                .expect(200)

            expect(responseBody.data).toEqual({
                balance: '0',
                earnings: '0',
                expenses: '0',
                investments: '0',
            })
            expect(responseBody.message).toBe(ResponseMessage.SUCCESS)
        })
    })
})
