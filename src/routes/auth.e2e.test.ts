import request from 'supertest'

import { app } from '../app'
import { ResponseMessage, ResponseZodMessages } from '../shared'

import { makeUser } from '@/test'
import { invalidEmailCases, invalidPasswordCases } from '@/test/'

describe('Auth Routes E2E Tests', () => {
    describe('POST /api/auth/login', () => {
        describe('validation', () => {
            it.each(invalidEmailCases)(
                'should return 400 if email is $description',
                async ({ email, expectedMessage }) => {
                    // arrange
                    const invalidParams = {
                        email,
                        password: 'validPassword123',
                    }

                    // act
                    const { body: responseBody } = await request(app)
                        .post('/api/auth/login')
                        .send(invalidParams)
                        .expect(400)

                    // assert
                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )

            it.each(invalidPasswordCases)(
                'should return 400 if password is $description',
                async ({ password, expectedMessage }) => {
                    // arrange
                    const invalidParams = {
                        email: 'valid@email.com',
                        password,
                    }

                    // act
                    const { body: responseBody } = await request(app)
                        .post('/api/auth/login')
                        .send(invalidParams)
                        .expect(400)

                    // assert
                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )
        })

        it('should return 200 and tokens when user is logged in', async () => {
            const user = await makeUser('1234562')

            const { body: responseBody } = await request(app)
                .post(`/api/auth/login`)
                .send({
                    email: user.email,
                    password: '1234562',
                })
                .expect(200)

            expect(responseBody.message).toBe(
                ResponseMessage.USER_LOGIN_SUCCESS,
            )
            expect(responseBody?.data?.tokens?.accessToken).toBeDefined()
            expect(responseBody?.data?.tokens?.refreshToken).toBeDefined()
        })
    })

    describe('POST /api/auth/refresh-token', () => {
        describe('validation', () => {
            it.each([
                [
                    'is not provided',
                    {},
                    ResponseZodMessages.refreshToken.required,
                ],
                [
                    'is null',
                    { refreshToken: null },
                    ResponseZodMessages.refreshToken.required,
                ],
                [
                    'is undefined',
                    { refreshToken: undefined },
                    ResponseZodMessages.refreshToken.required,
                ],
                [
                    'is empty string',
                    { refreshToken: '' },
                    ResponseZodMessages.refreshToken.minLength,
                ],
                [
                    'is only whitespace',
                    { refreshToken: '   ' },
                    ResponseZodMessages.refreshToken.minLength,
                ],
            ])(
                'should return 400 if refreshToken %s',
                async (_description, body, expectedMessage) => {
                    const { body: responseBody } = await request(app)
                        .post('/api/auth/refresh-token')
                        .send(body)
                        .expect(400)

                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )
        })

        it('should return 201 and new tokens when token is valid', async () => {
            const user = await makeUser()

            const { body: responseBody } = await request(app)
                .post(`/api/auth/refresh-token`)
                .send({
                    refreshToken: user.tokens.refreshToken,
                })
                .expect(201)
            expect(responseBody.message).toBe(ResponseMessage.TOKEN_REFRESHED)
            expect(responseBody.data.accessToken).toBeDefined()
            expect(responseBody.data.refreshToken).toBeDefined()
        })
    })
})
