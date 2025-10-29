import { mock, MockProxy } from 'jest-mock-extended'

import { UserNotFoundError } from '@/errors'
import { PostgresDeleteUserRepository } from '@/repositories/postgres'
import { DeleteUserService } from '@/services'
import {
    deleteUserRepositoryResponse,
    deleteUserServiceResponse,
    userId,
} from '@/test'

describe('DeleteUserService', () => {
    let sut: DeleteUserService
    let deleteUserRepository: MockProxy<PostgresDeleteUserRepository>

    beforeEach(() => {
        deleteUserRepository = mock<PostgresDeleteUserRepository>()
        sut = new DeleteUserService(deleteUserRepository)

        // Happy path setup - configure success scenario by default
        deleteUserRepository.execute.mockResolvedValue(
            deleteUserRepositoryResponse,
        )
    })

    describe('error handling', () => {
        it('should throw UserNotFoundError if DeleteUserRepository throws it', async () => {
            // arrange
            deleteUserRepository.execute.mockRejectedValueOnce(
                new UserNotFoundError(userId),
            )

            // act
            const promise = sut.execute(userId)

            // assert
            await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
        })

        it('should throw if DeleteUserRepository throws other errors', async () => {
            // arrange
            deleteUserRepository.execute.mockRejectedValueOnce(
                new Error('Database error'),
            )

            // act
            const promise = sut.execute(userId)

            // assert
            await expect(promise).rejects.toThrow('Database error')
        })
    })

    describe('success', () => {
        it('should successefully delete an user', async () => {
            // act
            const response = await sut.execute(userId)

            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual(deleteUserServiceResponse)
        })
    })

    describe('repository integration', () => {
        it('should call deleteUserRepository with correct params', async () => {
            // act
            await sut.execute(userId)

            // assert
            expect(deleteUserRepository.execute).toHaveBeenCalledWith(userId)
            expect(deleteUserRepository.execute).toHaveBeenCalledTimes(1)
        })
    })
})
