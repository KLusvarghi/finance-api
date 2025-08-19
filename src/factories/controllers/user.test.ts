import { makeCreateUserController } from './user'

import { CreateUserController } from '@/controllers'

describe('User Controller Factories', () => {
    it('should return a valid CreateUserController instance', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })
})
