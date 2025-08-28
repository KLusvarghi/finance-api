// import jwt from 'jsonwebtoken'

import { TokenGeneratorAdapter } from './token-generator'

import { UserIdMissingError } from '@/errors'
// import { faker } from '@faker-js/faker'

// Faz mock de todo o módulo jwt
jest.mock('jsonwebtoken')

describe('TokenGeneratorAdapter', () => {
    const sut = new TokenGeneratorAdapter()
    // const userId = faker.string.uuid()

    it('should throw UserIdMissingError when userId is empty', async () => {
        const promise = sut.execute('')

        await expect(promise).rejects.toThrow(UserIdMissingError)
    })
})
