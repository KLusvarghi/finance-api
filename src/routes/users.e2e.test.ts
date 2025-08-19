import request from 'supertest'

import { app } from '../..'
import { ResponseMessage } from '../shared'

import { createUserParams, userResponse } from '@/test'

describe('User Routes E2E Tests', () => {
    describe('POST /api/users', () => {
        it('should return 201 when user is created', async () => {
            const response = await request(app)
                .post('/api/users')
                .send(createUserParams)
                .expect(201)
                .expect('Content-Type', /json/)

            expect(response.body.data).toEqual({
                ...userResponse,
                id: expect.any(String),
            })
            expect(response.body.message).toBe(ResponseMessage.USER_CREATED)
        })
    })
})
