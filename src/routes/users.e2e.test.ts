import request from 'supertest'

import { app } from '../app'
import { ResponseMessage, ResponseZodMessages } from '../shared'

import {
    createUserParams,
    makeUser,
    makeUserBalance,
    updateUserParams,
} from '@/test'
import {
    createInvalidNameCases,
    invalidEmailCases,
    invalidPasswordCases,
} from '@/test/'
import { TransactionType } from '@prisma/client'

// Ao invpes de chamar a rota, poderiamos chamar direto o Prisma, mas dessa forma chamando nossas rotas, conseguimos testar o fluxo completo, desde a requisição até a resposta

describe('User Routes E2E Tests', () => {
    describe('GET /api/users/me', () => {
        it('should return 200 when user is found', async () => {
            const user = await makeUser()

            const { body: responseBody } = await request(app)
                .get(`/api/users/me`)
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .expect(200)

            expect(responseBody.data.id).toEqual(user.id)
            expect(responseBody.message).toBe(ResponseMessage.SUCCESS)
        })
    })

    describe('GET /api/users/me/balance', () => {
        describe('validation', () => {
            it.each([
                [
                    'from is not provided',
                    { to: '2025-08-08' },
                    'From is required',
                ],
                [
                    'from is invalid format',
                    { from: '2025/08/01', to: '2025-08-08' },
                    'From must be in YYYY-MM-DD format',
                ],
                [
                    'from is invalid date',
                    { from: '2025-13-32', to: '2025-08-08' },
                    'From must be in YYYY-MM-DD format',
                ],
                [
                    'to is not provided',
                    { from: '2025-08-01' },
                    'To is required',
                ],
                [
                    'to is invalid format',
                    { from: '2025-08-01', to: '2025/08/08' },
                    'To must be in YYYY-MM-DD format',
                ],
                [
                    'to is invalid date',
                    { from: '2025-08-01', to: '2025-13-32' },
                    'To must be in YYYY-MM-DD format',
                ],
            ])(
                'should return 400 if %s',
                async (_description, query, expectedMessage) => {
                    const user = await makeUser()

                    const { body: responseBody } = await request(app)
                        .get('/api/users/me/balance')
                        .query(query)
                        .set(
                            'authorization',
                            `Bearer ${user.tokens.accessToken}`,
                        )
                        .expect(400)

                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )
        })

        it('should return 200 when user balance is found', async () => {
            const user = await makeUser()
            const from = '2025-08-01'
            const to = '2025-08-08'

            await makeUserBalance(
                user.id,
                user.tokens.accessToken,
                from,
                10000,
                TransactionType.EARNING,
            )

            await makeUserBalance(
                user.id,
                user.tokens.accessToken,
                from,
                2000,
                TransactionType.INVESTMENT,
            )

            await makeUserBalance(
                user.id,
                user.tokens.accessToken,
                from,
                2000,
                TransactionType.EXPENSE,
            )

            const { body: responseBody } = await request(app)
                .get(`/api/users/me/balance`)
                .query({ from, to })
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
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
        describe('validation', () => {
            const invalidFirstNameCases = createInvalidNameCases({
                required: ResponseZodMessages.firstName.required,
                minLength: ResponseZodMessages.firstName.minLength,
            })

            const invalidLastNameCases = createInvalidNameCases({
                required: ResponseZodMessages.lastName.required,
                minLength: ResponseZodMessages.lastName.minLength,
            })

            it.each(invalidFirstNameCases)(
                'should return 400 if firstName is $description',
                async ({ name, expectedMessage }) => {
                    // arrange
                    const invalidParams = {
                        ...createUserParams,
                        firstName: name,
                    }

                    // act
                    const { body: responseBody } = await request(app)
                        .post('/api/users')
                        .send(invalidParams)
                        .expect(400)

                    // assert
                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )

            it.each(invalidLastNameCases)(
                'should return 400 if lastName is $description',
                async ({ name, expectedMessage }) => {
                    // arrange
                    const invalidParams = {
                        ...createUserParams,
                        lastName: name,
                    }

                    // act
                    const { body: responseBody } = await request(app)
                        .post('/api/users')
                        .send(invalidParams)
                        .expect(400)

                    // assert
                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )

            it.each(invalidEmailCases)(
                'should return 400 if email is $description',
                async ({ email, expectedMessage }) => {
                    // arrange
                    const invalidParams = { ...createUserParams, email }

                    // act
                    const { body: responseBody } = await request(app)
                        .post('/api/users')
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
                    const invalidParams = { ...createUserParams, password }

                    // act
                    const { body: responseBody } = await request(app)
                        .post('/api/users')
                        .send(invalidParams)
                        .expect(400)

                    // assert
                    expect(responseBody.success).toBe(false)
                    expect(responseBody.message).toBe(expectedMessage)
                },
            )
        })

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
            const user = await makeUser()

            const { body: responseBody } = await request(app)
                .post(`/api/users`)
                .send({ ...createUserParams, email: user.email })
                .expect(400)

            expect(responseBody.message).toBe(
                `The e-mail ${user.email} is already in use`,
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

    describe('PATCH /api/users/me', () => {
        describe('validation', () => {
            it('should return 400 if email is invalid', async () => {
                const user = await makeUser()

                const { body: responseBody } = await request(app)
                    .patch('/api/users/me')
                    .set('authorization', `Bearer ${user.tokens.accessToken}`)
                    .send({ email: 'invalid_email' })
                    .expect(400)

                expect(responseBody.success).toBe(false)
                expect(responseBody.message).toBe(
                    ResponseZodMessages.email.invalid,
                )
            })

            it('should return 400 if password is too short', async () => {
                const user = await makeUser()

                const { body: responseBody } = await request(app)
                    .patch('/api/users/me')
                    .set('authorization', `Bearer ${user.tokens.accessToken}`)
                    .send({ password: '123' })
                    .expect(400)

                expect(responseBody.success).toBe(false)
                expect(responseBody.message).toBe(
                    ResponseZodMessages.password.minLength,
                )
            })

            it('should return 400 if disallowed field is provided', async () => {
                const user = await makeUser()

                const { body: responseBody } = await request(app)
                    .patch('/api/users/me')
                    .set('authorization', `Bearer ${user.tokens.accessToken}`)
                    .send({
                        firstName: 'Valid Name',
                        disallowedField: 'not allowed',
                    })
                    .expect(400)

                expect(responseBody.success).toBe(false)
                expect(responseBody.message).toContain('Unrecognized key')
                expect(responseBody.message).toContain('disallowedField')
            })
        })

        it('should return 200 when user is updated', async () => {
            const user = await makeUser()

            const { body: responseBody } = await request(app)
                .patch(`/api/users/me`)
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .send(updateUserParams)
                .expect(200)

            expect(responseBody.data.id).toEqual(user.id)
            expect(responseBody.data).not.toHaveProperty('password')
            expect(responseBody.message).toBe(ResponseMessage.USER_UPDATED)
        })
    })

    describe('DELETE /api/users/me', () => {
        it('should return 200 when user is deleted', async () => {
            const user = await makeUser()

            const { body: responseBody } = await request(app)
                .delete(`/api/users/me`)
                .set('authorization', `Bearer ${user.tokens.accessToken}`)
                .expect(200)

            expect(responseBody.message).toBe(ResponseMessage.USER_DELETED)
        })
    })
})
