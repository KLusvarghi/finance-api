import { mock, MockProxy } from 'jest-mock-extended'

import { IdGeneratorAdapter } from '@/adapters'
import { UserNotFoundError } from '@/errors'
import { CreateTransactionService } from '@/services'
import { CreateTransactionRepository, GetUserByIdRepository } from '@/shared'
import {
    createTransactionRepositoryResponse,
    createTransactionServiceParams,
    createTransactionServiceResponse,
    getUserByIdRepositoryResponse,
} from '@/test'

describe('CreateTransactionService', () => {
    let sut: CreateTransactionService
    let createTransactionRepository: MockProxy<CreateTransactionRepository>
    let getUserByIdRepository: MockProxy<GetUserByIdRepository>
    let idGenerator: MockProxy<IdGeneratorAdapter>

    beforeEach(() => {
        createTransactionRepository = mock<CreateTransactionRepository>()
        getUserByIdRepository = mock<GetUserByIdRepository>()
        idGenerator = mock<IdGeneratorAdapter>()

        sut = new CreateTransactionService(
            createTransactionRepository,
            getUserByIdRepository,
            idGenerator,
        )
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })

    describe('error handling', () => {
        it('should throw UserNotFoundError if user is not found', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(null)

            // act
            const promise = sut.execute(createTransactionServiceParams)

            // assert
            await expect(promise).rejects.toThrow(
                new UserNotFoundError(createTransactionServiceParams.userId),
            )
        })

        it('should throw if GetUserByIdRepository throws', async () => {
            // arrange
            getUserByIdRepository.execute.mockRejectedValue(new Error())

            // act
            const promise = sut.execute(createTransactionServiceParams)

            // assert
            await expect(promise).rejects.toThrow()
        })

        it('should throw if IdGeneratorAdapter throws', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(
                getUserByIdRepositoryResponse,
            )
            idGenerator.execute.mockImplementationOnce(() => {
                throw new Error('idGenerator error')
            })

            // act
            const promise = sut.execute(createTransactionServiceParams)

            // assert
            await expect(promise).rejects.toThrow(
                new Error('idGenerator error'),
            )
        })

        it('should throw if CreateTransactionRepository throws', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(
                getUserByIdRepositoryResponse,
            )
            idGenerator.execute.mockReturnValue(
                createTransactionServiceResponse.id,
            )
            createTransactionRepository.execute.mockRejectedValue(
                new Error('createTransactionRepository error'),
            )

            // act
            const promise = sut.execute(createTransactionServiceParams)

            // assert
            await expect(promise).rejects.toThrow(
                new Error('createTransactionRepository error'),
            )
        })
    })

    describe('success', () => {
        it('should create transaction successfully', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(
                getUserByIdRepositoryResponse,
            )
            idGenerator.execute.mockReturnValue(
                createTransactionServiceResponse.id,
            )
            createTransactionRepository.execute.mockResolvedValue(
                createTransactionRepositoryResponse,
            )

            // act
            const response = await sut.execute(createTransactionServiceParams)

            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual(
                expect.objectContaining({
                    id: createTransactionServiceResponse.id,
                    name: createTransactionServiceResponse.name,
                    amount: createTransactionServiceResponse.amount,
                    type: createTransactionServiceResponse.type,
                    userId: createTransactionServiceResponse.userId,
                    date: createTransactionServiceResponse.date,
                }),
            )
            expect(response.updatedAt).toBeInstanceOf(Date)
        })
    })

    describe('validations', () => {
        it('should call GetUserByIdRepository with correct params', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(
                getUserByIdRepositoryResponse,
            )
            idGenerator.execute.mockReturnValue(
                createTransactionServiceResponse.id,
            )
            createTransactionRepository.execute.mockResolvedValue(
                createTransactionRepositoryResponse,
            )

            // act
            await sut.execute(createTransactionServiceParams)

            // assert
            expect(getUserByIdRepository.execute).toHaveBeenCalledWith(
                createTransactionServiceParams.userId,
            )
            expect(getUserByIdRepository.execute).toHaveBeenCalledTimes(1)
        })

        it('should call IdGeneratorAdapter to generate a random uuid', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(
                getUserByIdRepositoryResponse,
            )
            idGenerator.execute.mockReturnValue(
                createTransactionServiceResponse.id,
            )
            createTransactionRepository.execute.mockResolvedValue(
                createTransactionRepositoryResponse,
            )

            // act
            await sut.execute(createTransactionServiceParams)

            // assert
            expect(idGenerator.execute).toHaveBeenCalled()
            expect(idGenerator.execute).toHaveBeenCalledTimes(1)
            expect(idGenerator.execute).toHaveReturnedWith(
                createTransactionServiceResponse.id,
            )
        })

        it('should call CreateTransactionRepository with correct params', async () => {
            // arrange
            getUserByIdRepository.execute.mockResolvedValue(
                getUserByIdRepositoryResponse,
            )
            idGenerator.execute.mockReturnValue(
                createTransactionServiceResponse.id,
            )
            createTransactionRepository.execute.mockResolvedValue(
                createTransactionRepositoryResponse,
            )

            // act
            const response = await sut.execute(createTransactionServiceParams)

            // assert
            expect(createTransactionRepository.execute).toHaveBeenCalledWith({
                ...createTransactionServiceParams,
                id: createTransactionServiceResponse.id,
            })
            expect(createTransactionRepository.execute).toHaveBeenCalledTimes(1)
            expect(response).toEqual(
                expect.objectContaining({
                    id: createTransactionServiceResponse.id,
                    name: createTransactionServiceResponse.name,
                    amount: createTransactionServiceResponse.amount,
                    type: createTransactionServiceResponse.type,
                    userId: createTransactionServiceResponse.userId,
                    date: createTransactionServiceResponse.date,
                }),
            )
        })
    })
})
