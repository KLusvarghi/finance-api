import { UserNotFoundError } from '@/errors'
import { GetUserBalanceService } from '@/services'
import { UserBalanceRepositoryResponse, UserRepositoryResponse } from '@/shared'
import {
    getUserBalanceServiceResponse,
    getUserByIdRepositoryResponse,
    userId,
} from '@/test'

describe('GetUserBalanceService', () => {
    let sut: GetUserBalanceService
    let getUserByIdRepository: GetUserByIdRepositoryStub
    let getUserBalanceRepository: GetUserBalanceRepositoryStub

    class GetUserByIdRepositoryStub {
        async execute(_id: string): Promise<UserRepositoryResponse | null> {
            return Promise.resolve(getUserByIdRepositoryResponse)
        }
    }

    class GetUserBalanceRepositoryStub {
        async execute(_id: string): Promise<UserBalanceRepositoryResponse> {
            return Promise.resolve(getUserBalanceServiceResponse)
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const sut = new GetUserBalanceService(
            getUserByIdRepository,
            getUserBalanceRepository,
        )

        return {
            sut,
            getUserByIdRepository,
            getUserBalanceRepository,
        }
    }

    beforeEach(() => {
        const {
            sut: service,
            getUserByIdRepository: getUserByIdRepositoryStub,
            getUserBalanceRepository: getUserBalanceRepositoryStub,
        } = makeSut()

        sut = service
        getUserByIdRepository = getUserByIdRepositoryStub
        getUserBalanceRepository = getUserBalanceRepositoryStub
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })

    describe('error handling', () => {
        it('should return UserNotFoundError if GetUserByIdRepository returns null', async () => {
            // arrange
            jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
                null,
            )

            // act
            const promise = sut.execute(userId)

            // assert
            expect(promise).rejects.toThrow(new UserNotFoundError(userId))
        })

        // garantindo que o nosso service não está tratando a excessão do nosso repository e passando para cima para o nosso controller
        it('should throw if getUserByIdRepository throws', async () => {
            // arrange
            jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
                new Error(),
            )

            // act
            const promise = sut.execute(userId)

            // assert
            expect(promise).rejects.toThrow()
        })

        it('should throw if GetUserBalanceRepository throws', async () => {
            // arrange
            jest.spyOn(
                getUserBalanceRepository,
                'execute',
            ).mockRejectedValueOnce(new Error())

            // act
            const promise = sut.execute(userId)

            // assert
            expect(promise).rejects.toThrow()
        })
    })

    describe('success', () => {
        it('should successefully get user balance', async () => {
            // act
            const response = await sut.execute(userId)

            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual(getUserBalanceServiceResponse)
        })
    })

    describe('validations', () => {
        //  validando se o getUserByIdRepository foi chamado com o id correto
        it('should call GetUserByIdRepository with correct params', async () => {
            // arrange
            const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

            // act
            await sut.execute(userId)

            // assert
            expect(executeSpy).toHaveBeenCalledWith(userId)
            expect(executeSpy).toHaveBeenCalledTimes(1)
        })

        it('should call GetUserBalanceRepository with correct params', async () => {
            // arrange
            const executeSpy = jest.spyOn(getUserBalanceRepository, 'execute')

            // act
            await sut.execute(userId)

            // assert
            expect(executeSpy).toHaveBeenCalledWith(userId)
            expect(executeSpy).toHaveBeenCalledTimes(1)
        })
    })
})
