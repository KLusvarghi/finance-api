import jwt from 'jsonwebtoken'

import { TokenVerifierAdapter } from './token-veriry'

import { ExpiredTokenError, InvalidTokenError } from '@/errors'
import { faker } from '@faker-js/faker'

describe('TokenVerifierAdapter', () => {
    let sut: TokenVerifierAdapter
    let validToken: string
    let expiredToken: string
    let invalidToken: string
    let secret: string
    let mockPayload: jwt.JwtPayload

    const makeSut = () => {
        const sut = new TokenVerifierAdapter()
        return { sut }
    }

    beforeEach(() => {
        // Setup executado antes de cada teste
        const { sut: adapter } = makeSut()
        sut = adapter
        secret = faker.string.alphanumeric(32)
        mockPayload = {
            sub: faker.string.uuid(),
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        }

        // Generate real tokens for testing
        validToken = jwt.sign(mockPayload, secret)
        expiredToken = jwt.sign(
            { ...mockPayload, exp: Math.floor(Date.now() / 1000) - 3600 }, // 1 hour ago
            secret,
        )
        invalidToken = faker.string.alphanumeric(50)
    })

    afterEach(() => {
        // Limpeza após cada teste
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('error handling', () => {
        it('should throw ExpiredTokenError if token is expired', async () => {
            // act
            const promise = sut.execute(expiredToken, secret)

            // assert
            await expect(promise).rejects.toThrow(ExpiredTokenError)
        })

        it('should throw InvalidTokenError if token is malformed', async () => {
            // act
            const promise = sut.execute(invalidToken, secret)

            // assert
            await expect(promise).rejects.toThrow(InvalidTokenError)
        })

        it('should throw InvalidTokenError if token signature is invalid', async () => {
            // arrange
            const wrongSecret = faker.string.alphanumeric(32)

            // act
            const promise = sut.execute(validToken, wrongSecret)

            // assert
            await expect(promise).rejects.toThrow(InvalidTokenError)
        })

        it('should throw InvalidTokenError if token is empty', async () => {
            // act
            const promise = sut.execute('', secret)

            // assert
            await expect(promise).rejects.toThrow(InvalidTokenError)
        })

        it('should throw InvalidTokenError if secret is empty', async () => {
            // act
            const promise = sut.execute(validToken, '')

            // assert
            await expect(promise).rejects.toThrow(InvalidTokenError)
        })
    })

    describe('success cases', () => {
        it('should return decoded payload if token is valid', async () => {
            // act
            const result = await sut.execute(validToken, secret)

            // assert
            expect(result).toBeDefined()
            expect(typeof result).toBe('object')
            if (typeof result === 'object' && result !== null) {
                expect(result).toHaveProperty('sub', mockPayload.sub)
                expect(result).toHaveProperty('iat')
                expect(result).toHaveProperty('exp')
            }
        })

        it('should call jwt.verify with correct parameters', async () => {
            // arrange
            const jwtSpy = jest.spyOn(jwt, 'verify')

            // act
            await sut.execute(validToken, secret)

            // assert
            expect(jwtSpy).toHaveBeenCalledWith(validToken, secret)
            expect(jwtSpy).toHaveBeenCalledTimes(1)

            // cleanup
            jwtSpy.mockRestore()
        })
    })
})
