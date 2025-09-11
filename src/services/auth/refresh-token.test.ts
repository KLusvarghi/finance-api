import jwt from 'jsonwebtoken'

import { RefreshTokenService } from './refresh-token'

import { UnauthorizedError } from '@/errors'
import { TokensGeneratorAdapterResponse } from '@/shared'
import { tokensGeneratorAdapterResponse } from '@/test'

describe('RefreshTokenService', () => {
    let sut: RefreshTokenService
    let tokenVerifierAdapter: TokenVerifierAdapterStub
    // let TokensGeneratorAdapter: TokensGeneratorAdapterStub

    // class RefreshTokenServiceStub {
    //     async execute(
    //         _refreshToken: string,
    //     ): Promise<TokensGeneratorAdapterResponse> {
    //         return Promise.resolve(tokensGeneratorAdapterResponse)
    //     }
    // }

    class TokenVerifierAdapterStub {
        async execute(_refreshToken: string): Promise<string | jwt.JwtPayload> {
            return Promise.resolve(jwt.decode)
        }
    }

    class TokensGeneratorAdapterStub {
        async execute(
            _userId: string,
        ): Promise<TokensGeneratorAdapterResponse> {
            return Promise.resolve(tokensGeneratorAdapterResponse)
        }
    }

    const makeSut = () => {
        const tokenVerifierAdapter = new TokenVerifierAdapterStub()
        const TokensGeneratorAdapter = new TokensGeneratorAdapterStub()
        const sut = new RefreshTokenService(
            TokensGeneratorAdapter,
            tokenVerifierAdapter,
        )

        return {
            sut,
            tokenVerifierAdapter,
            TokensGeneratorAdapter,
        }
    }

    beforeEach(() => {
        const {
            sut: service,
            tokenVerifierAdapter: tokenVerifierAdapterStub,
            // TokensGeneratorAdapter: TokensGeneratorAdapterStub,
        } = makeSut()
        sut = service
        tokenVerifierAdapter = tokenVerifierAdapterStub
        // TokensGeneratorAdapter = TokensGeneratorAdapterStub
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })

    describe('error handling', () => {
        it('should throw UnauthorizedError if tokenVerifierAdapter returns string', async () => {
            // arrange
            jest.spyOn(tokenVerifierAdapter, 'execute').mockResolvedValueOnce(
                'invalid_refresh_token',
            )

            // act
            const promise = sut.execute('invalid_refresh_token')

            // assert
            expect(promise).rejects.toThrow(new UnauthorizedError())
        })
    })

    describe('success', () => {
        it('should return tokensGeneratorAdapterResponse if tokenVerifierAdapter returns object', async () => {
            // arrange
            jest.spyOn(tokenVerifierAdapter, 'execute').mockResolvedValueOnce(
                tokensGeneratorAdapterResponse,
            )

            // act
            const promise = await sut.execute(
                tokensGeneratorAdapterResponse.refreshToken,
            )

            // assert
            expect(promise).toEqual(tokensGeneratorAdapterResponse)
        })
    })
})
