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

    const tokensResponse: TokensGeneratorAdapterResponse = {
        accessToken: 'any_access_token',
        refreshToken: 'any_refresh_token',
    }

    beforeEach(() => {
        getUserByEmailRepository = mock<GetUserByEmailRepository>()
        passwordComparator = mock<PasswordComparatorAdapter>()
        tokensGeneratorAdapter = mock<TokensGeneratorAdapter>()

        sut = new AuthenticateUserService(
            getUserByEmailRepository,
            passwordComparator,
            tokensGeneratorAdapter,
        )

        // Happy path setup - configure success scenario by default
        getUserByEmailRepository.execute.mockResolvedValue(
            createUserRepositoryResponse,
        )
        passwordComparator.execute.mockResolvedValue(true)
        tokensGeneratorAdapter.execute.mockResolvedValue(tokensResponse)
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

    describe('success', () => {
        it('should return user and tokens', async () => {
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

    describe('repository integration', () => {
        it('should call GetUserByEmailRepository with correct email', async () => {
            // act
            await sut.execute('any_email', 'any_password')

            // assert
            expect(getUserByEmailRepository.execute).toHaveBeenCalledWith(
                'any_email',
            )
            expect(getUserByEmailRepository.execute).toHaveBeenCalledTimes(1)
        })
    })

    describe('adapter integration', () => {
        it('should call PasswordComparator with correct password', async () => {
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
