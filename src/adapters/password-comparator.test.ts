import bcrypt from 'bcrypt'

import { PasswordComparatorAdapter } from './password-comparator'

// Faz mock de todo o módulo bcrypt
jest.mock('bcrypt')

describe('PasswordComparatorAdapter', () => {
    const sut = new PasswordComparatorAdapter()
    const password = 'plain_password'
    const hashedPassword = '$2b$12$saltsaltsaltsaltsaltHash'

    it('should return true when passwords match', async () => {
        ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

        const result = await sut.execute(password, hashedPassword)

        expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword)
        expect(result).toBe(true)
    })

    it('should return false when passwords do not match', async () => {
        ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

        const result = await sut.execute(password, hashedPassword)

        expect(result).toBe(false)
    })
})
