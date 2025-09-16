import { mock, MockProxy } from 'jest-mock-extended'

import { UserNotFoundError } from '@/errors'
import { GetTransactionsByUserIdService } from '@/services'
import {
    GetTransactionsByUserIdRepository,
    GetUserByIdRepository,
} from '@/shared'
import {
    getTransactionByUserIdRepositoryResponse,
    getTransactionByUserIdServiceResponse,
    getUserByIdRepositoryResponse,
    userId,
} from '@/test'

describe('GetTransactionsByUserIdService', () => {
    let sut: GetTransactionsByUserIdService
    let getUserByIdRepository: MockProxy<GetUserByIdRepository>
    let getTransactionByUserIdRepository: MockProxy<GetTransactionsByUserIdRepository>

    const from = '2025-01-01'
    const to = '2025-01-31'

    beforeEach(() => {
        getUserByIdRepository = mock<GetUserByIdRepository>()
        getTransactionByUserIdRepository =
            mock<GetTransactionsByUserIdRepository>()

        sut = new GetTransactionsByUserIdService(
            getUserByIdRepository,
            getTransactionByUserIdRepository,
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })

    describe('error handling', () => {
        it('should throw UserNotFoundError if user not found', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValueOnce(null)

            // act
            const promise = sut.execute(userId, from, to)

            // assert
            await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
        })

        it('should throw if GetUserByIdRepository throws', async () => {
            // arrange
            getUserByIdRepository.execute.mockRejectedValueOnce(
                new Error('GetUserByIdRepository error'),
            )

            // act
            const promise = sut.execute(userId, from, to)

            // assert
            await expect(promise).rejects.toThrow(
                new Error('GetUserByIdRepository error'),
            )
        })

        it('should throw if GetTransactionsByUserIdRepository throws', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(
                getUserByIdRepositoryResponse,
            )
            getTransactionByUserIdRepository.execute.mockRejectedValueOnce(
                new Error('GetTransactionsByUserIdRepository error'),
            )

            // act
            const promise = sut.execute(userId, from, to)

            // assert
            await expect(promise).rejects.toThrow(
                new Error('GetTransactionsByUserIdRepository error'),
            )
        })
    })

    describe('success', () => {
        it('should get transactions by user id successfully', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(
                getUserByIdRepositoryResponse,
            )
            getTransactionByUserIdRepository.execute.mockResolvedValue([
                {
                    ...getTransactionByUserIdRepositoryResponse[0],
                    deletedAt: null,
                },
            ])

            // act
            const response = await sut.execute(userId, from, to)

            // assert
            expect(response).toEqual(getTransactionByUserIdServiceResponse)
        })
    })

    describe('validations', () => {
        it('should call GetUserByIdRepository with correct params', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(
                getUserByIdRepositoryResponse,
            )
            getTransactionByUserIdRepository.execute.mockResolvedValue([
                {
                    ...getTransactionByUserIdRepositoryResponse[0],
                    deletedAt: null,
                },
            ])

            // act
            await sut.execute(userId, from, to)

            // assert
            expect(getUserByIdRepository.execute).toHaveBeenCalledWith(userId)
            expect(getUserByIdRepository.execute).toHaveBeenCalledTimes(1)
        })

        it('should call GetTransactionByUserIdRepository with correct params', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(
                getUserByIdRepositoryResponse,
            )
            getTransactionByUserIdRepository.execute.mockResolvedValue([
                {
                    ...getTransactionByUserIdRepositoryResponse[0],
                    deletedAt: null,
                },
            ])

            // act
            await sut.execute(userId, from, to)

            // assert
            expect(
                getTransactionByUserIdRepository.execute,
            ).toHaveBeenCalledWith(userId, from, to)
            expect(
                getTransactionByUserIdRepository.execute,
            ).toHaveBeenCalledTimes(1)
        })
    })
})
