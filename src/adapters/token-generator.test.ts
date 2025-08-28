import { TokenGeneratorAdapter } from './token-generator'

import { UserIdMissingError } from '@/errors'
import { faker } from '@faker-js/faker'

describe('TokenGeneratorAdapter', () => {
    let sut: TokenGeneratorAdapter
    let userId: string

    beforeEach(() => {
        sut = new TokenGeneratorAdapter()
        userId = faker.string.uuid()
    })

    describe('success', () => {
        it('should return tokens if valid userId is provided', async () => {
            const response = await sut.execute(userId)

            expect(response).toEqual({
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            })
        })
    })

    describe('validations', () => {
        it('should throw UserIdMissingError when userId is empty', async () => {
            const promise = sut.execute('')

            await expect(promise).rejects.toThrow(UserIdMissingError)
        })

        it('should throw UserIdMissingError when userId is null', async () => {
            const promise = sut.execute(null as unknown as string)

            await expect(promise).rejects.toThrow(UserIdMissingError)
        })

        it('should throw UserIdMissingError when userId is undefined', async () => {
            const promise = sut.execute(undefined as unknown as string)

            await expect(promise).rejects.toThrow(UserIdMissingError)
        })
    })
})
