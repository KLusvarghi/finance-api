import { faker } from '@faker-js/faker'
import {
    TransactionPublicResponse,
    TransactionRepositoryResponse,
    UserRepositoryResponse,
} from '@/shared'
import { Prisma } from '@prisma/client'
import { GetTransactionsByUserIdService } from './get-transactions-by-user-id'
import { UserNotFoundError } from '@/errors/user'

describe('DeleteTransactionService', () => {
    let sut: GetTransactionsByUserIdService
    let getUserByIdRepository: GetUserByIdRepositoryStub
    let getTransactionByUserIdRepository: GetTransactionsByUserIdRepositoryStub

    let validGetUserByIdRepositoryResponse: UserRepositoryResponse | null
    let validTransactionRepositoryResponse:
        | TransactionRepositoryResponse[]
        | null
    let validTransactionServiceResponse: TransactionPublicResponse[] | null
    let validUserId: string

    class GetUserByIdRepositoryStub {
        async execute(_userId: string): Promise<UserRepositoryResponse | null> {
            return Promise.resolve(validGetUserByIdRepositoryResponse)
        }
    }

    class GetTransactionsByUserIdRepositoryStub {
        async execute(
            _userId: string,
        ): Promise<TransactionRepositoryResponse[] | null> {
            return Promise.resolve(validTransactionRepositoryResponse)
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

        validUserId = faker.string.uuid()

        validGetUserByIdRepositoryResponse = {
            id: validUserId,
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        validTransactionRepositoryResponse = [
            {
                id: faker.string.uuid(),
                user_id: validUserId,
                name: faker.lorem.words(3),
                amount: new Prisma.Decimal(
                    faker.number.int({ min: 1, max: 1000 }),
                ),
                date: faker.date.recent(),
                type: faker.helpers.arrayElement([
                    'EARNING',
                    'EXPENSE',
                    'INVESTMENT',
                ]),
            },
        ]

        validTransactionServiceResponse = [
            {
                id: validTransactionRepositoryResponse[0].id,
                user_id: validUserId,
                name: validTransactionRepositoryResponse[0].name,
                amount: validTransactionRepositoryResponse[0].amount,
                date: validTransactionRepositoryResponse[0].date,
                type: validTransactionRepositoryResponse[0].type,
            },
        ]
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
            const promise = sut.execute(validUserId)

            // assert
            expect(promise).rejects.toThrow(new UserNotFoundError(validUserId))
        })
    })

    describe('success', () => {
        it('should get transactions by user id successfully', async () => {
            // act
            const response = await sut.execute(validUserId)

            // assert
            expect(response).toEqual(validTransactionServiceResponse)
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
            await sut.execute(validUserId)

            // assert
            expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(validUserId)
            expect(getUserByIdRepositorySpy).toHaveBeenCalledTimes(1)
        })

        it('should call GetTransactionByUserIdRepository with correct params', async () => {
            // arrange
            const getTransactionByUserIdRepositorySpy = jest.spyOn(
                getTransactionByUserIdRepository,
                'execute',
            )

            // act
            await sut.execute(validUserId)

            // assert
            expect(getTransactionByUserIdRepositorySpy).toHaveBeenCalledWith(
                validUserId,
            )
            expect(getTransactionByUserIdRepositorySpy).toHaveBeenCalledTimes(1)
        })
    })
})
