import { mock, MockProxy } from 'jest-mock-extended'

import { UserNotFoundError } from '@/errors'
import { GetUserBalanceService } from '@/services'
import { GetUserBalanceRepository, GetUserByIdRepository } from '@/shared'
import {
    getUserBalanceServiceResponse,
    getUserByIdRepositoryResponse,
    userId,
} from '@/test'

describe('GetUserBalanceService', () => {
    let sut: GetUserBalanceService
    let getUserByIdRepository: MockProxy<GetUserByIdRepository>
    let getUserBalanceRepository: MockProxy<GetUserBalanceRepository>

    beforeEach(() => {
        getUserByIdRepository = mock<GetUserByIdRepository>()
        getUserBalanceRepository = mock<GetUserBalanceRepository>()

        sut = new GetUserBalanceService(
            getUserByIdRepository,
            getUserBalanceRepository,
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })

    const from = '2025-08-01'
    const to = '2025-08-08'

    describe('error handling', () => {
        it('should return UserNotFoundError if GetUserByIdRepository returns null', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValueOnce(null)

            // act
            const promise = sut.execute(userId, from, to)

            // assert
            await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
        })

        it('should throw if getUserByIdRepository throws', async () => {
            // arrange
            getUserByIdRepository.execute.mockRejectedValueOnce(new Error())

            // act
            const promise = sut.execute(userId, from, to)

            // assert
            await expect(promise).rejects.toThrow()
        })

        it('should throw if GetUserBalanceRepository throws', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(
                getUserByIdRepositoryResponse,
            )
            getUserBalanceRepository.execute.mockRejectedValueOnce(new Error())

            // act
            const promise = sut.execute(userId, from, to)

            // assert
            await expect(promise).rejects.toThrow()
        })
    })

    describe('success', () => {
        it('should successefully get user balance', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(
                getUserByIdRepositoryResponse,
            )
            getUserBalanceRepository.execute.mockResolvedValue(
                getUserBalanceServiceResponse,
            )

            // act
            const response = await sut.execute(userId, from, to)

            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual(getUserBalanceServiceResponse)
        })
    })

    describe('validations', () => {
        it('should call GetUserByIdRepository with correct params', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(
                getUserByIdRepositoryResponse,
            )
            getUserBalanceRepository.execute.mockResolvedValue(
                getUserBalanceServiceResponse,
            )

            // act
            await sut.execute(userId, from, to)

            // assert
            expect(getUserByIdRepository.execute).toHaveBeenCalledWith(userId)
            expect(getUserByIdRepository.execute).toHaveBeenCalledTimes(1)
        })

        it('should call GetUserBalanceRepository with correct params', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(
                getUserByIdRepositoryResponse,
            )
            getUserBalanceRepository.execute.mockResolvedValue(
                getUserBalanceServiceResponse,
            )

            // act
            await sut.execute(userId, from, to)

            // assert
            expect(getUserBalanceRepository.execute).toHaveBeenCalledWith(
                userId,
                from,
                to,
            )
            expect(getUserBalanceRepository.execute).toHaveBeenCalledTimes(1)
        })
    })
})
