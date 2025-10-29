import request from 'supertest'

import { makeUser } from '@/test'
import { invalidEmailCases, invalidPasswordCases } from '@/test/'

import { app } from '../app'
import { ResponseMessage, ResponseZodMessages } from '../shared'

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

        describe('rate limiting', () => {
            it('should return 429 after exceeding rate limit', async () => {
                const user = await makeUser('1234562')
                const loginData = {
                    email: user.email,
                    password: '1234562',
                }

                // Fazer múltiplas requisições para exceder o limite (preset strict = 5 requests)
                const requests = []
                for (let i = 0; i < 6; i++) {
                    requests.push(
                        request(app).post('/api/auth/login').send(loginData),
                    )
                }

                const responses = await Promise.all(requests)

                // As primeiras 5 requisições devem ter sucesso ou falhar por credenciais
                // A 6ª deve falhar por rate limiting
                const lastResponse = responses[responses.length - 1]

                expect(lastResponse.status).toBe(429)
                expect(lastResponse.body.error).toBe('Too Many Requests')
                expect(lastResponse.headers['ratelimit-limit']).toBe('5')
                expect(lastResponse.headers['ratelimit-remaining']).toBe('0')
                expect(lastResponse.headers['retry-after']).toBeDefined()
            }, 30000)

            it('should pass when rate limiting is in shadow mode', async () => {
                // arrange - enable shadow mode
                const originalShadowMode = process.env.RATE_LIMITER_SHADOW_MODE
                process.env.RATE_LIMITER_SHADOW_MODE = 'true'

                try {
                    const user = await makeUser('1234562')
                    const loginData = {
                        email: user.email,
                        password: '1234562',
                    }

                    // Fazer múltiplas requisições para exceder o limite (preset strict = 5 requests)
                    // Em shadow mode, todas devem passar
                    const requests = []
                    for (let i = 0; i < 10; i++) {
                        requests.push(
                            request(app)
                                .post('/api/auth/login')
                                .send(loginData),
                        )
                    }

                    const responses = await Promise.all(requests)

                    // Em shadow mode, todas as requisições devem passar (200) ou falhar apenas por credenciais
                    // Nenhuma deve falhar por rate limiting (429)
                    responses.forEach((response) => {
                        expect(response.status).not.toBe(429)
                    })

                    // Pelo menos uma requisição deve ter sucesso (a primeira com credenciais corretas)
                    const successfulResponses = responses.filter(
                        (r) => r.status === 200,
                    )
                    expect(successfulResponses.length).toBeGreaterThanOrEqual(1)
                } finally {
                    // restore original value
                    if (originalShadowMode !== undefined) {
                        process.env.RATE_LIMITER_SHADOW_MODE =
                            originalShadowMode
                    } else {
                        delete process.env.RATE_LIMITER_SHADOW_MODE
                    }
                }
            })
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
