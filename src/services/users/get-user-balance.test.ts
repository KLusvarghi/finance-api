import {
    UserBalanceRepositoryResponse,
    UserRepositoryResponse,
} from '@/shared/types'
import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '@/errors/user'
import { GetUserBalanceService } from './get-user-balance'
import { Prisma } from '@prisma/client'

describe('GetUserBalanceService', () => {
    let sut: GetUserBalanceService
    let getUserByIdRepository: GetUserByIdRepositoryStub
    let getUserBalanceRepository: GetUserBalanceRepositoryStub
    let validGetUserByIdRepositoryResponse: UserRepositoryResponse | null
    let validGetUserBalanceResponse: UserBalanceRepositoryResponse
    let validUserId: string

    class GetUserByIdRepositoryStub {
        async execute(_id: string): Promise<UserRepositoryResponse | null> {
            return Promise.resolve(validGetUserByIdRepositoryResponse)
        }
    }

    class GetUserBalanceRepositoryStub {
        async execute(_id: string): Promise<UserBalanceRepositoryResponse> {
            return Promise.resolve(validGetUserBalanceResponse)
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

        validUserId = faker.string.uuid()

        validGetUserByIdRepositoryResponse = {
            id: validUserId,
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        }

        validGetUserBalanceResponse = {
            earnings: faker.number.int({ min: 1, max: 1000 }),
            expenses: faker.number.int({ min: 1, max: 1000 }),
            investments: faker.number.int({ min: 1, max: 1000 }),
            balance: new Prisma.Decimal(faker.number.float()),
        }
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
            const promise = sut.execute(validUserId)

            // assert
            expect(promise).rejects.toThrow(new UserNotFoundError(validUserId))
        })

        // garantindo que o nosso service não está tratando a excessão do nosso repository e passando para cima para o nosso controller
        it('should throw if GetUserBalanceRepository throws', async () => {
            // arrange
            jest.spyOn(getUserBalanceRepository, 'execute').mockRejectedValueOnce(
                new Error(),
            )

            // act
            const promise = sut.execute(validUserId)

            // assert
            expect(promise).rejects.toThrow()
        })
    })







    describe('success', () => {
        it('should successefully get user balance', async () => {
            // act
            const response = await sut.execute(validUserId)

            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual(validGetUserBalanceResponse)
        })
    })





    describe('validations', () => {
        //  validando se o getUserByIdRepository foi chamado com o id correto
        it('should call GetUserByIdRepository with correct params', async () => {
            // arrange
            const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

            // act
            await sut.execute(validUserId)

            // assert
            expect(executeSpy).toHaveBeenCalledWith(validUserId)
            expect(executeSpy).toHaveBeenCalledTimes(1)
        })
    })
})
