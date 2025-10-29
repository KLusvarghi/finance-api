import { UserNotFoundError } from '@/errors'
import { GetUserByIdService } from '@/services'
import { UserRepositoryResponse } from '@/shared'
import {
    getUserByIdRepositoryResponse,
    getUserByIdServiceResponse,
    userId,
} from '@/test'

describe('GetUserByIdService', () => {
    let sut: GetUserByIdService
    let getUserByIdRepository: GetUserByIdRepositoryStub

    class GetUserByIdRepositoryStub {
        async execute(): Promise<UserRepositoryResponse | null> {
            return Promise.resolve(getUserByIdRepositoryResponse)
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserByIdService(getUserByIdRepository)

        return {
            sut,
            getUserByIdRepository,
        }
    }

    beforeEach(() => {
        const {
            sut: service,
            getUserByIdRepository: getUserByIdRepositoryStub,
        } = makeSut()

        sut = service
        getUserByIdRepository = getUserByIdRepositoryStub
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
            await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
        })

        // esse tipo de teste é importnate para garantir que o nosso service não está tratando a excessão do nosso repository e passando para cima para o nosso controller
        it('should throw if GetUserByIdRepository throws', async () => {
            // arrange
            jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
                new UserNotFoundError(userId),
            )

            // act
            const promise = sut.execute(userId)

            // assert
            await expect(promise).rejects.toThrow()
        })
    })

    describe('success', () => {
        it('should successefully get an user by id', async () => {
            // act
            const response = await sut.execute(userId)

            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual(getUserByIdServiceResponse)
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
    })
})
