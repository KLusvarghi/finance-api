import { mock, MockProxy } from 'jest-mock-extended'

import { TokensGeneratorAdapter, TokenVerifierAdapter } from '@/adapters'
import { UnauthorizedError } from '@/errors'
import { tokensGeneratorAdapterResponse } from '@/test'

import { RefreshTokenService } from './refresh-token'

describe('RefreshTokenService', () => {
    let sut: RefreshTokenService
    let tokenVerifierAdapter: MockProxy<TokenVerifierAdapter>
    let tokensGeneratorAdapter: MockProxy<TokensGeneratorAdapter>

    beforeEach(() => {
        tokenVerifierAdapter = mock<TokenVerifierAdapter>()
        tokensGeneratorAdapter = mock<TokensGeneratorAdapter>()

        sut = new RefreshTokenService(
            tokensGeneratorAdapter,
            tokenVerifierAdapter,
        )

        // Happy path setup - configure success scenario by default
        const decodedToken = { userId: 'valid_user_id' }
        tokenVerifierAdapter.execute.mockResolvedValue(decodedToken)
        tokensGeneratorAdapter.execute.mockResolvedValue(
            tokensGeneratorAdapterResponse,
        )
    })

    describe('error handling', () => {
        it('should throw UnauthorizedError if tokenVerifierAdapter returns string', async () => {
            // arrange
            tokenVerifierAdapter.execute.mockResolvedValueOnce(
                'invalid_refresh_token',
            )

            // act
            const promise = sut.execute('invalid_refresh_token')

            // assert
            await expect(promise).rejects.toThrow(new UnauthorizedError())
        })
    })

    describe('success', () => {
        it('should return tokensGeneratorAdapterResponse if tokenVerifierAdapter returns object', async () => {
            // act
            const result = await sut.execute('valid_refresh_token')

            // assert
            expect(result).toEqual(tokensGeneratorAdapterResponse)
        })
    })

    describe('adapter integration', () => {
        it('should call tokensGeneratorAdapter with correct userId', async () => {
            // act
            await sut.execute('valid_refresh_token')

            // assert
            expect(tokensGeneratorAdapter.execute).toHaveBeenCalledWith(
                'valid_user_id',
            )
        })
    })
})
