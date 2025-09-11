import { AuthenticateUserService } from './authenticate-user'

import { LoginFailedError } from '@/errors'
import {
    TokensGeneratorAdapterResponse,
    UserRepositoryResponse,
} from '@/shared'
import { createUserRepositoryResponse } from '@/test'

describe('AuthenticateUserService', () => {
    let sut: AuthenticateUserService
    let getUserByEmailRepository: GetUserByEmailRepositoryStub
    let passwordComparator: PasswordComparatorAdapterStub
    let TokensGeneratorAdapter: TokensGeneratorAdapterStub

    class GetUserByEmailRepositoryStub {
        async execute(_email: string): Promise<UserRepositoryResponse | null> {
            return Promise.resolve(createUserRepositoryResponse)
        }
    }

    class PasswordComparatorAdapterStub {
        async execute(
            _password: string,
            _hashedPassword: string,
        ): Promise<boolean> {
            return Promise.resolve(true)
        }
    }

    class TokensGeneratorAdapterStub {
        async execute(
            _userId: string,
        ): Promise<TokensGeneratorAdapterResponse> {
            return Promise.resolve({
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            })
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const passwordComparator = new PasswordComparatorAdapterStub()
        const TokensGeneratorAdapter = new TokensGeneratorAdapterStub()
        const sut = new AuthenticateUserService(
            getUserByEmailRepository,
            passwordComparator,
            TokensGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            passwordComparator,
            TokensGeneratorAdapter,
        }
    }

    beforeEach(() => {
        const {
            sut: service,
            getUserByEmailRepository: getUserByEmailRepositoryStub,
            passwordComparator: passwordComparatorStub,
            TokensGeneratorAdapter: TokensGeneratorAdapterStub,
        } = makeSut()

        sut = service
        getUserByEmailRepository = getUserByEmailRepositoryStub
        passwordComparator = passwordComparatorStub
        TokensGeneratorAdapter = TokensGeneratorAdapterStub
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('Error handling', () => {
        it('should throw UserNotFoundError if user is not found', async () => {
            // arrange
            jest.spyOn(
                getUserByEmailRepository,
                'execute',
            ).mockResolvedValueOnce(null)

            // act
            const promise = sut.execute('any_email', 'any_password')

            // assert
            await expect(promise).rejects.toThrow(new LoginFailedError())
        })

        it('should throw LoginFailedError if password is invalid', async () => {
            // arrange
            jest.spyOn(passwordComparator, 'execute').mockResolvedValueOnce(
                false,
            )

            // act
            const promise = sut.execute('any_password', 'any_hashed_password')

            // assert
            await expect(promise).rejects.toThrow(new LoginFailedError())
        })
    })

    describe('Success', () => {
        it('should return user and tokens', async () => {
            // act
            const response = await sut.execute('any_email', 'any_password')

            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual({
                ...createUserRepositoryResponse,
                tokens: {
                    accessToken: 'any_access_token',
                    refreshToken: 'any_refresh_token',
                },
            })
        })
    })

    describe('validations', () => {
        it('should call GetUserByEmailRepository with correct email', async () => {
            // arrange
            const executeSpy = jest.spyOn(getUserByEmailRepository, 'execute')

            // act
            await sut.execute('any_email', 'any_password')

            // assert
            expect(executeSpy).toHaveBeenCalledWith('any_email')
            expect(executeSpy).toHaveBeenCalledTimes(1)
        })

        it('should call PasswordComparator with correct password', async () => {
            // arrange
            const executeSpy = jest.spyOn(passwordComparator, 'execute')

            // act
            await sut.execute('any_password', 'any_hashed_password')

            // assert
            expect(executeSpy).toHaveBeenCalledWith(
                'any_hashed_password',
                'valid_hash',
            )
            expect(executeSpy).toHaveBeenCalledTimes(1)
        })

        it('should call TokensGeneratorAdapter with correct userId', async () => {
            // arrange
            const executeSpy = jest.spyOn(TokensGeneratorAdapter, 'execute')

            // act
            await sut.execute('any_email', 'any_password')

            // assert
            expect(executeSpy).toHaveBeenCalledWith(
                createUserRepositoryResponse.id,
            )
            expect(executeSpy).toHaveBeenCalledTimes(1)
        })
    })
})
