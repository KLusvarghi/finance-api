import { faker } from '@faker-js/faker'

import { PasswordHasherAdapter } from './password-hasher'

describe('PasswordHasherAdapter', () => {
    it('should return a hash of the password', async () => {
        // arrange
        const sut = new PasswordHasherAdapter()
        const password = faker.internet.password()

        // act
        const response = await sut.execute(password)

        // asset
        expect(response).toBeTruthy()
        expect(typeof response).toBe('string')
        expect(response).not.toBe(password)
    })
})
