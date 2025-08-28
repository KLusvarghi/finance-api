import { PasswordComparatorAdapter } from './password-comparator'

import { faker } from '@faker-js/faker'

describe('PasswordComparatorAdapter', () => {
    it('should return true if the password is valid', async () => {
        // arrange
        const sut = new PasswordComparatorAdapter()
        const password = faker.internet.password()
        const hashedPassword = password

        // act
        const response = await sut.execute(password, hashedPassword)

        // assert
        expect(response).toBe(true)
    })
})
