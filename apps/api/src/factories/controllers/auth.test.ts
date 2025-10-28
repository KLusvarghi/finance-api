import {
    AuthenticateUserController,
    RefreshTokenController,
} from '@/controllers'

import {
    makeAuthLoginUserController,
    makeAuthRefreshTokenController,
} from './auth'

describe('Auth Controller Factories', () => {
    it('should return a valid AuthenticateUserController instance', () => {
        expect(makeAuthLoginUserController()).toBeInstanceOf(
            AuthenticateUserController,
        )
    })

    it('should return a valid RefreshTokenController instance', () => {
        expect(makeAuthRefreshTokenController()).toBeInstanceOf(
            RefreshTokenController,
        )
    })
})
