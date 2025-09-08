import { UserNotFoundError } from '@/errors'
import { GetTransactionsByUserIdService } from '@/services'
import { TransactionRepositoryResponse, UserRepositoryResponse } from '@/shared'
import {
    getTransactionByUserIdRepositoryResponse,
    getTransactionByUserIdServiceResponse,
    getUserByIdRepositoryResponse,
    userId,
} from '@/test'

describe('GetTransactionsByUserIdService', () => {
    let sut: GetTransactionsByUserIdService
    let getUserByIdRepository: GetUserByIdRepositoryStub
    let getTransactionByUserIdRepository: GetTransactionsByUserIdRepositoryStub

    const from = '2025-01-01'
    const to = '2025-01-31'

    class GetUserByIdRepositoryStub {
        async execute(_userId: string): Promise<UserRepositoryResponse | null> {
            return Promise.resolve(getUserByIdRepositoryResponse)
        }
    }

    class GetTransactionsByUserIdRepositoryStub {
        async execute(
            _userId: string,
            _from: string,
            _to: string,
        ): Promise<TransactionRepositoryResponse[]> {
            return Promise.resolve(getTransactionByUserIdRepositoryResponse)
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const getTransactionByUserIdRepository =
            new GetTransactionsByUserIdRepositoryStub()
        const sut = new GetTransactionsByUserIdService(
            getUserByIdRepository,
            getTransactionByUserIdRepository,
        )

        return {
            sut,
            getUserByIdRepository,
            getTransactionByUserIdRepository,
        }
    }

    beforeEach(() => {
        const {
            sut: service,
            getUserByIdRepository: getUserByIdRepositoryStub,
            getTransactionByUserIdRepository:
                getTransactionByUserIdRepositoryStub,
        } = makeSut()

        sut = service
        getUserByIdRepository = getUserByIdRepositoryStub
        getTransactionByUserIdRepository = getTransactionByUserIdRepositoryStub
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })

    describe('error handling', () => {
        it('should throw UserNotFoundError if user not found', async () => {
            // arrange
            jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
                null,
            )
            // act
            const promise = sut.execute(userId, from, to)

            // assert
            expect(promise).rejects.toThrow(new UserNotFoundError(userId))
        })

        // garantindo que o erro é passado para cima (controller)
        it('should throw if GetUserByIdRepository throws', async () => {
            // arrange
            jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
                new Error('GetUserByIdRepository error'),
            )
            // act
            const promise = sut.execute(userId, from, to)

            // assert
            expect(promise).rejects.toThrow(
                new Error('GetUserByIdRepository error'),
            )
        })

        it('should throw if GetTransactionsByUserIdRepository throws', async () => {
            // arrange
            jest.spyOn(
                getTransactionByUserIdRepository,
                'execute',
            ).mockRejectedValueOnce(
                new Error('GetTransactionsByUserIdRepository error'),
            )
            // act
            const promise = sut.execute(userId, from, to)

            // assert
            expect(promise).rejects.toThrow(
                new Error('GetTransactionsByUserIdRepository error'),
            )
        })
    })

    describe('success', () => {
        it('should get transactions by user id successfully', async () => {
            // act
            const response = await sut.execute(userId, from, to)

            // assert
            expect(response).toEqual(getTransactionByUserIdServiceResponse)
        })
    })

    describe('validations', () => {
        it('should call GetUserByIdRepository with correct params', async () => {
            // arrange
            const getUserByIdRepositorySpy = jest.spyOn(
                getUserByIdRepository,
                'execute',
            )

            // act
            await sut.execute(userId, from, to)

            // assert
            expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId)
            expect(getUserByIdRepositorySpy).toHaveBeenCalledTimes(1)
        })

        it('should call GetTransactionByUserIdRepository with correct params', async () => {
            // arrange
            const getTransactionByUserIdRepositorySpy = jest.spyOn(
                getTransactionByUserIdRepository,
                'execute',
            )

            // act
            await sut.execute(userId, from, to)

            // assert
            expect(getTransactionByUserIdRepositorySpy).toHaveBeenCalledWith(
                userId,
                from,
                to,
            )
            expect(getTransactionByUserIdRepositorySpy).toHaveBeenCalledTimes(1)
        })
    })
})
