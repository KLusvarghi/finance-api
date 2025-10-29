import { mock, MockProxy } from 'jest-mock-extended'

import { PasswordHasherAdapter } from '@/adapters'
import {
    EmailAlreadyExistsError,
    UpdateUserFailedError,
    UserNotFoundError,
} from '@/errors'
import {
    PostgresGetUserByEmailRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateUserRepository,
} from '@/repositories/postgres'
import { UpdateUserService } from '@/services'
import {
    updateUserParams,
    updateUserRepositoryResponse,
    updateUserServiceResponse,
    userId,
} from '@/test'

describe('UpdateUserService', () => {
    let sut: UpdateUserService
    let updateUserRepository: MockProxy<PostgresUpdateUserRepository>
    let getUserByEmailRepository: MockProxy<PostgresGetUserByEmailRepository>
    let getUserByIdRepository: MockProxy<PostgresGetUserByIdRepository>
    let passwordHasherAdapter: MockProxy<PasswordHasherAdapter>

    beforeEach(() => {
        updateUserRepository = mock<PostgresUpdateUserRepository>()
        getUserByEmailRepository = mock<PostgresGetUserByEmailRepository>()
        getUserByIdRepository = mock<PostgresGetUserByIdRepository>()
        passwordHasherAdapter = mock<PasswordHasherAdapter>()

        sut = new UpdateUserService(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
            getUserByIdRepository,
        )

        // Default "happy path" setup for all tests
        getUserByIdRepository.execute.mockResolvedValue(
            updateUserRepositoryResponse,
        )
        updateUserRepository.execute.mockResolvedValue(
            updateUserRepositoryResponse,
        )
        passwordHasherAdapter.execute.mockResolvedValue('valid_hash')
        getUserByEmailRepository.execute.mockResolvedValue(null)
    })

    describe('error handling', () => {
        it('should throw UpdateUserFailedError if UpdateUserRepository throws', async () => {
            // arrange: Override the default happy path
            updateUserRepository.execute.mockRejectedValueOnce(
                new UpdateUserFailedError(),
            )

            // act
            const promise = sut.execute(userId, updateUserParams)

            // assert
            await expect(promise).rejects.toThrow(new UpdateUserFailedError())
        })

        it('should throw EmailAlreadyExistsError if email already exists', async () => {
            // arrange: Override the default happy path
            getUserByEmailRepository.execute.mockResolvedValueOnce(
                updateUserRepositoryResponse,
            )

            // act
            // Use a different user ID to simulate another user having the email
            const promise = sut.execute('different-user-id', {
                email: updateUserServiceResponse.email,
            })

            // assert
            await expect(promise).rejects.toThrow(
                new EmailAlreadyExistsError(updateUserServiceResponse.email),
            )
        })

        it('should throw UserNotFoundError if user is not found', async () => {
            // arrange: Override the default happy path
            getUserByIdRepository.execute.mockResolvedValueOnce(null)

            // act
            const promise = sut.execute(userId, {
                email: 'different-email@example.com',
            })

            // assert
            await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
        })

        it('should throw if PasswordHasherAdapter throws', async () => {
            // arrange: Override the default happy path
            passwordHasherAdapter.execute.mockRejectedValueOnce(new Error())

            // act
            const promise = sut.execute(userId, {
                password: 'different-password',
            })

            // assert
            await expect(promise).rejects.toThrow()
        })
    })

    describe('success', () => {
        it('should successfully update a user (without password and email)', async () => {
            // arrange is handled by beforeEach

            // act
            const response = await sut.execute(userId, updateUserParams)

            // assert
            expect(response).toEqual(updateUserServiceResponse)
        })

        it('should successfully update a user (with email)', async () => {
            // arrange
            const getUserByEmailRepositorySpy = jest.spyOn(
                getUserByEmailRepository,
                'execute',
            )

            // act
            const response = await sut.execute(userId, {
                email: updateUserServiceResponse.email,
            })

            // assert
            expect(response).toEqual(updateUserServiceResponse)
            expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(
                updateUserServiceResponse.email,
            )
        })

        it('should successfully update a user (with password)', async () => {
            // arrange
            const passwordHasherAdapterSpy = jest.spyOn(
                passwordHasherAdapter,
                'execute',
            )

            // act
            const response = await sut.execute(userId, {
                password: updateUserParams.password,
            })

            // assert
            expect(response).toEqual(updateUserServiceResponse)
            expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(
                updateUserParams.password,
            )
        })

        describe('validations', () => {
            it('should call UpdateUserRepository with correct params', async () => {
                // arrange
                const executeSpy = jest.spyOn(updateUserRepository, 'execute')

                // act
                await sut.execute(userId, updateUserParams)

                // assert
                const expectedParams = {
                    ...updateUserParams,
                    password: 'valid_hash',
                }

                expect(executeSpy).toHaveBeenCalledWith(userId, expectedParams)
                expect(executeSpy).toHaveBeenCalledTimes(1)
            })
        })
    })
})
