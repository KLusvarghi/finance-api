import { mock, MockProxy } from 'jest-mock-extended'

import {
    IdGeneratorAdapter,
    PasswordHasherAdapter,
    TokensGeneratorAdapter,
} from '@/adapters'
import { EmailAlreadyExistsError } from '@/errors'
import { CreateUserService } from '@/services'
import { CreateUserRepository, GetUserByEmailRepository } from '@/shared'
import {
    createUserParams,
    createUserRepositoryResponse,
    createUserServiceResponse,
    tokensGeneratorAdapterResponse,
} from '@/test'

describe('CreateUserService', () => {
    let sut: CreateUserService
    let createUserRepository: MockProxy<CreateUserRepository>
    let getUserByEmailRepository: MockProxy<GetUserByEmailRepository>
    let passwordHasherAdapter: MockProxy<PasswordHasherAdapter>
    let idGeneratorAdapter: MockProxy<IdGeneratorAdapter>
    let tokensGeneratorAdapter: MockProxy<TokensGeneratorAdapter>
    beforeEach(() => {
        createUserRepository = mock<CreateUserRepository>()
        getUserByEmailRepository = mock<GetUserByEmailRepository>()
        passwordHasherAdapter = mock<PasswordHasherAdapter>()
        idGeneratorAdapter = mock<IdGeneratorAdapter>()
        tokensGeneratorAdapter = mock<TokensGeneratorAdapter>()

        sut = new CreateUserService(
            createUserRepository,
            getUserByEmailRepository,
            idGeneratorAdapter,
            passwordHasherAdapter,
            tokensGeneratorAdapter,
        )

        // Happy path setup - configure success scenario by default
        getUserByEmailRepository.execute.mockResolvedValue(null)
        idGeneratorAdapter.execute.mockReturnValue(createUserServiceResponse.id)
        passwordHasherAdapter.execute.mockResolvedValue(
            createUserRepositoryResponse.password,
        )
        createUserRepository.execute.mockResolvedValue(
            createUserRepositoryResponse,
        )
        tokensGeneratorAdapter.execute.mockResolvedValue(
            tokensGeneratorAdapterResponse,
        )
    })

    describe('error handling', () => {
        it('should throw an EmailAlreadyExistsError if getUserByEmailRepository returns a user', async () => {
            // arrange
            getUserByEmailRepository.execute.mockResolvedValueOnce(
                createUserRepositoryResponse,
            )

            // act
            const promise = sut.execute(createUserParams)

            // assert
            await expect(promise).rejects.toThrow(
                new EmailAlreadyExistsError(createUserParams.email),
            )
        })

        it('should throw if GetUserByEmailRepository throws', async () => {
            // arrange
            getUserByEmailRepository.execute.mockRejectedValueOnce(new Error())

            // act
            const promise = sut.execute(createUserParams)

            // assert
            await expect(promise).rejects.toThrow()
        })

        it('should throw if IdGeneratorAdapter throws', async () => {
            // arrange
            getUserByEmailRepository.execute.mockResolvedValue(null)
            idGeneratorAdapter.execute.mockImplementationOnce(() => {
                throw new Error()
            })

            // act
            const promise = sut.execute(createUserParams)

            // assert
            await expect(promise).rejects.toThrow()
        })

        it('should throw if PasswordHasherAdapter throws', async () => {
            // arrange
            getUserByEmailRepository.execute.mockResolvedValue(null)
            idGeneratorAdapter.execute.mockReturnValue(
                createUserServiceResponse.id,
            )
            passwordHasherAdapter.execute.mockRejectedValueOnce(new Error())

            // act
            const promise = sut.execute(createUserParams)

            // assert
            await expect(promise).rejects.toThrow()
        })

        it('should throw if CreateUserRepository throws', async () => {
            // arrange
            getUserByEmailRepository.execute.mockResolvedValue(null)
            idGeneratorAdapter.execute.mockReturnValue(
                createUserServiceResponse.id,
            )
            passwordHasherAdapter.execute.mockResolvedValue(
                createUserRepositoryResponse.password,
            )
            createUserRepository.execute.mockRejectedValueOnce(new Error())

            // act
            const promise = sut.execute(createUserParams)

            // assert
            await expect(promise).rejects.toThrow()
        })

        it('should throw if TokensGeneratorAdapter throws', async () => {
            // arrange
            getUserByEmailRepository.execute.mockResolvedValue(null)
            idGeneratorAdapter.execute.mockReturnValue(
                createUserServiceResponse.id,
            )
            passwordHasherAdapter.execute.mockResolvedValue(
                createUserRepositoryResponse.password,
            )
            createUserRepository.execute.mockResolvedValue(
                createUserRepositoryResponse,
            )
            tokensGeneratorAdapter.execute.mockRejectedValueOnce(new Error())

            // act
            const promise = sut.execute(createUserParams)

            // assert
            await expect(promise).rejects.toThrow()
        })
    })

    describe('success', () => {
        it('should create a user successfully', async () => {
            // act
            const response = await sut.execute(createUserParams)

            // assert
            expect(response).toBeTruthy()
            expect(response).toStrictEqual({
                ...createUserServiceResponse,
                tokens: tokensGeneratorAdapterResponse,
            })
            expect(response.tokens.accessToken).toBeDefined()
            expect(response.tokens.refreshToken).toBeDefined()
        })
    })

    describe('repository integration', () => {
        it('should call CreateUserRepository with correct params', async () => {
            // act
            await sut.execute(createUserParams)

            // assert
            expect(createUserRepository.execute).toHaveBeenCalledWith({
                ...createUserParams,
                id: createUserServiceResponse.id,
                password: createUserRepositoryResponse.password,
            })
            expect(createUserRepository.execute).toHaveBeenCalledTimes(1)
        })
    })

    describe('adapter integration', () => {
        it('should call idGeneratorAdapter to generate a random uuid', async () => {
            // act
            await sut.execute(createUserParams)

            // assert
            expect(idGeneratorAdapter.execute).toHaveBeenCalled()
            expect(idGeneratorAdapter.execute).toHaveBeenCalledTimes(1)
        })

        it('should call passwordHasherAdapter to hash the password', async () => {
            // act
            await sut.execute(createUserParams)

            // assert
            expect(passwordHasherAdapter.execute).toHaveBeenCalledWith(
                createUserParams.password,
            )
            expect(passwordHasherAdapter.execute).toHaveBeenCalledTimes(1)
        })
    })
})
