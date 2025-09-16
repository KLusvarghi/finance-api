import { mock, MockProxy } from 'jest-mock-extended'

import { AuthenticateUserService } from './authenticate-user'

import { LoginFailedError } from '@/errors'
import {
    GetUserByEmailRepository,
    PasswordComparatorAdapter,
    TokensGeneratorAdapter,
    TokensGeneratorAdapterResponse,
} from '@/shared'
import { createUserRepositoryResponse } from '@/test'

describe('AuthenticateUserService', () => {
    let sut: AuthenticateUserService
    let getUserByEmailRepository: MockProxy<GetUserByEmailRepository>
    let passwordComparator: MockProxy<PasswordComparatorAdapter>
    let tokensGeneratorAdapter: MockProxy<TokensGeneratorAdapter>

    beforeEach(() => {
        getUserByEmailRepository = mock<GetUserByEmailRepository>()
        passwordComparator = mock<PasswordComparatorAdapter>()
        tokensGeneratorAdapter = mock<TokensGeneratorAdapter>()

        sut = new AuthenticateUserService(
            getUserByEmailRepository,
            passwordComparator,
            tokensGeneratorAdapter,
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('Error handling', () => {
        it('should throw UserNotFoundError if user is not found', async () => {
            // arrange
            getUserByEmailRepository.execute.mockResolvedValueOnce(null)

            // act
            const promise = sut.execute('any_email', 'any_password')

            // assert
            await expect(promise).rejects.toThrow(new LoginFailedError())
        })

        it('should throw LoginFailedError if password is invalid', async () => {
            // arrange
            getUserByEmailRepository.execute.mockResolvedValueOnce(
                createUserRepositoryResponse,
            )
            passwordComparator.execute.mockResolvedValueOnce(false)

            // act
            const promise = sut.execute('any_email', 'any_password')

            // assert
            await expect(promise).rejects.toThrow(new LoginFailedError())
        })
    })

    describe('Success', () => {
        it('should return user and tokens', async () => {
            // arrange
            const tokensResponse: TokensGeneratorAdapterResponse = {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }

            getUserByEmailRepository.execute.mockResolvedValueOnce(
                createUserRepositoryResponse,
            )
            passwordComparator.execute.mockResolvedValueOnce(true)
            tokensGeneratorAdapter.execute.mockResolvedValueOnce(tokensResponse)

            // act
            const response = await sut.execute('any_email', 'any_password')

            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual({
                ...createUserRepositoryResponse,
                tokens: tokensResponse,
            })
        })
    })

    describe('validations', () => {
        it('should call GetUserByEmailRepository with correct email', async () => {
            // arrange
            getUserByEmailRepository.execute.mockResolvedValueOnce(
                createUserRepositoryResponse,
            )
            passwordComparator.execute.mockResolvedValueOnce(true)
            tokensGeneratorAdapter.execute.mockResolvedValueOnce({
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            })

            // act
            await sut.execute('any_email', 'any_password')

            // assert
            expect(getUserByEmailRepository.execute).toHaveBeenCalledWith(
                'any_email',
            )
            expect(getUserByEmailRepository.execute).toHaveBeenCalledTimes(1)
        })

        it('should call PasswordComparator with correct password', async () => {
            // arrange
            getUserByEmailRepository.execute.mockResolvedValueOnce(
                createUserRepositoryResponse,
            )
            passwordComparator.execute.mockResolvedValueOnce(true)
            tokensGeneratorAdapter.execute.mockResolvedValueOnce({
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            })

            // act
            await sut.execute('any_email', 'any_password')

            // assert
            expect(passwordComparator.execute).toHaveBeenCalledWith(
                'any_password',
                'valid_hash',
            )
            expect(passwordComparator.execute).toHaveBeenCalledTimes(1)
        })

        it('should call TokensGeneratorAdapter with correct userId', async () => {
            // arrange
            getUserByEmailRepository.execute.mockResolvedValueOnce(
                createUserRepositoryResponse,
            )
            passwordComparator.execute.mockResolvedValueOnce(true)
            tokensGeneratorAdapter.execute.mockResolvedValueOnce({
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            })

            // act
            await sut.execute('any_email', 'any_password')

            // assert
            expect(tokensGeneratorAdapter.execute).toHaveBeenCalledWith(
                createUserRepositoryResponse.id,
            )
            expect(tokensGeneratorAdapter.execute).toHaveBeenCalledTimes(1)
        })
    })
})
