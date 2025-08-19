import request from 'supertest'

import { app } from '../app'
import { ResponseMessage } from '../shared'

import { createUserParams, userResponse } from '@/test'

describe('User Routes E2E Tests', () => {
    describe('POST /api/users', () => {
        it('should return 201 when user is created', async () => {
            const { body: responseBody } = await request(app)
                .post('/api/users')
                .send(createUserParams)
                .expect(201)
                .expect('Content-Type', /json/)

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

            const { body: responseBody } = await request(app).get(
                `/api/users/${createdUser.data.id}`,
            )

            expect(responseBody.data).toEqual(createdUser.data)
        })
    })
})
