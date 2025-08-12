import {
    CreateTransactionParams,
    TransactionPublicResponse,
    TransactionRepositoryResponse,
    UserRepositoryResponse,
} from '@/shared/types'
import { CreateTransactionService } from './create-transaction'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import { UserNotFoundError } from '@/errors/user'

describe('CreateTransactionService', () => {
    let sut: CreateTransactionService
    let createTransactionRepository: CreateTransactionRepositoryStub
    let getUserByIdRepository: GetUserByIdRepositoryStub
    let idGenerator: IdGeneratorAdapterStub
    let validTransactionId: string
    let createTransactionParams: CreateTransactionParams
    let validCreateTransactionServiceResponse: TransactionPublicResponse
    let validCreateTransactionRepositoryResponse: TransactionRepositoryResponse
    let validGetUserByIdRepositoryResponse: UserRepositoryResponse

    class CreateTransactionRepositoryStub {
        async execute(
            _params: CreateTransactionParams,
        ): Promise<TransactionRepositoryResponse> {
            return Promise.resolve(validCreateTransactionRepositoryResponse)
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(_userId: string): Promise<UserRepositoryResponse | null> {
            return Promise.resolve(validGetUserByIdRepositoryResponse)
        }
    }

    class IdGeneratorAdapterStub {
        execute(): string {
            return validCreateTransactionServiceResponse.id
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const idGenerator = new IdGeneratorAdapterStub()
        const sut = new CreateTransactionService(
            createTransactionRepository,
            getUserByIdRepository,
            idGenerator,
        )
        return {
            sut,
            createTransactionRepository,
            getUserByIdRepository,
            idGenerator,
        }
    }

    beforeEach(() => {
        const {
            sut: service,
            createTransactionRepository: createTransactionRepositoryStub,
            getUserByIdRepository: getUserByIdRepositoryStub,
            idGenerator: idGeneratorAdapterStub,
        } = makeSut()

        sut = service
        createTransactionRepository = createTransactionRepositoryStub
        getUserByIdRepository = getUserByIdRepositoryStub
        idGenerator = idGeneratorAdapterStub

        validTransactionId = faker.string.uuid()
        createTransactionParams = {
            user_id: faker.string.uuid(),
            name: faker.finance.transactionDescription(),
            amount: faker.number.int({ min: 1, max: 1000 }),
            date: faker.date.recent().toISOString(),
            type: faker.helpers.arrayElement([
                'EARNING',
                'EXPENSE',
                'INVESTMENT',
            ]),
        }

        validCreateTransactionServiceResponse = {
            id: validTransactionId,
            user_id: createTransactionParams.user_id,
            name: createTransactionParams.name,
            amount: new Prisma.Decimal(createTransactionParams.amount),
            date: new Date(createTransactionParams.date),
            type: createTransactionParams.type as
                | 'EARNING'
                | 'EXPENSE'
                | 'INVESTMENT',
        }

        validCreateTransactionRepositoryResponse = {
            id: validTransactionId,
            user_id: createTransactionParams.user_id,
            name: createTransactionParams.name,
            amount: new Prisma.Decimal(createTransactionParams.amount),
            date: new Date(createTransactionParams.date),
            type: createTransactionParams.type as
                | 'EARNING'
                | 'EXPENSE'
                | 'INVESTMENT',
        }

        validGetUserByIdRepositoryResponse = {
            id: createTransactionParams.user_id,
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        }
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })

    describe('error handling', () => {
        it('should throw UserNotFoundError if user is not found', async () => {
          // arrange
           jest.spyOn(
                getUserByIdRepository,
                'execute',
            ).mockResolvedValue(null)

            // act
            // lembrando que não passamos o await para que a promise não seja resolvida
            // e sim rejeitada
            const promise = sut.execute(createTransactionParams)

            // assert
            await expect(promise).rejects.toThrow(
                new UserNotFoundError(createTransactionParams.user_id),
            )
        })
    })

    describe('success', () => {
        it('should create transaction successfully', async () => {
            // act
            const response = await sut.execute(createTransactionParams)

            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual(validCreateTransactionServiceResponse)
        })
    })

    describe('validations', () => {
        it('should call GetUserByIdRepository with correct params', async () => {
            const getUserByIdRepositorySpy = jest.spyOn(
                getUserByIdRepository,
                'execute',
            )

            await sut.execute(createTransactionParams)

            expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(
                createTransactionParams.user_id,
            )
            expect(getUserByIdRepositorySpy).toHaveBeenCalledTimes(1)
        })

        it('should call IdGeneratorAdapter to generate a random uuid', async () => {
            const idGeneratorAdapterSpy = jest.spyOn(idGenerator, 'execute')

            await sut.execute(createTransactionParams)

            expect(idGeneratorAdapterSpy).toHaveBeenCalled()
            expect(idGeneratorAdapterSpy).toHaveBeenCalledTimes(1)
            expect(idGeneratorAdapterSpy).toHaveReturnedWith(validTransactionId)
        })

        it('should call CreateTransactionRepository with correct params', async () => {
            const createTransactionRepositorySpy = jest.spyOn(
                createTransactionRepository,
                'execute',
            )

            const response = await sut.execute(createTransactionParams)

            expect(createTransactionRepositorySpy).toHaveBeenCalledWith({
                ...createTransactionParams,
                id: validTransactionId,
            })
            expect(createTransactionRepositorySpy).toHaveBeenCalledTimes(1)
            expect(response).toEqual(validCreateTransactionServiceResponse)
        })
    })
})
