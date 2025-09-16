import jwt from 'jsonwebtoken'

import { TokensGeneratorAdapter } from './tokens-generator'

// import { UserIdMissingError } from '@/errors'
import { ResponseMessage } from '@/shared'
import { faker } from '@faker-js/faker'

jest.mock('jsonwebtoken')

describe('TokensGeneratorAdapter', () => {
    const sut = new TokensGeneratorAdapter()
    const userId = faker.string.uuid()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('errors handling', () => {
        it('should throw an Error if generate token fails', async () => {
            ;(jwt.sign as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Failed to generate tokens')
            })

            const promise = sut.execute(userId)

            await expect(promise).rejects.toThrow(
                new Error(ResponseMessage.TOKEN_GENERATION_FAILED),
            )
        })
    })

    describe('success', () => {
        it('should return tokens if valid userId is provided', async () => {
            // Mock jwt.sign to return different tokens for access and refresh
            ;(jwt.sign as jest.Mock)
                .mockReturnValueOnce('access-token-123')
                .mockReturnValueOnce('refresh-token-456')

            const response = await sut.execute(userId)

            expect(response).toEqual({
                accessToken: 'access-token-123',
                refreshToken: 'refresh-token-456',
            })
            expect(response.accessToken).toBeTruthy()
            expect(response.refreshToken).toBeTruthy()
            expect(response.accessToken).not.toBe(response.refreshToken)
        })
    })
})
