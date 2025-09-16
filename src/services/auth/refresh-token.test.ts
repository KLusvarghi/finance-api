import { mock, MockProxy } from 'jest-mock-extended'

import { RefreshTokenService } from './refresh-token'

import { TokensGeneratorAdapter, TokenVerifierAdapter } from '@/adapters'
import { UnauthorizedError } from '@/errors'
import { tokensGeneratorAdapterResponse } from '@/test'

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
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
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
            // arrange
            const decodedToken = { userId: 'valid_user_id' }
            tokenVerifierAdapter.execute.mockResolvedValueOnce(decodedToken)
            tokensGeneratorAdapter.execute.mockResolvedValueOnce(
                tokensGeneratorAdapterResponse,
            )

            // act
            const result = await sut.execute('valid_refresh_token')

            // assert
            expect(result).toEqual(tokensGeneratorAdapterResponse)
            expect(tokensGeneratorAdapter.execute).toHaveBeenCalledWith(
                'valid_user_id',
            )
        })
    })
})
