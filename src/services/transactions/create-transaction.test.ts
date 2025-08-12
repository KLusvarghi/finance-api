import {
    CreateTransactionParams,
    TransactionPublicResponse,
    UserRepositoryResponse,
} from '@/shared/types'
import { CreateTransactionService } from './create-transaction'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'

describe('CreateTransactionService', () => {
    let sut: CreateTransactionService
    let createTransactionRepository: CreateTransactionRepositoryStub
    let getUserByIdRepository: GetUserByIdRepositoryStub
    let idGenerator: IdGeneratorAdapterStub
    let validTransactionId: string
    let createTransactionParams: CreateTransactionParams
    let validCreateTransactionResponse: TransactionPublicResponse
    let validGetUserByIdRepositoryResponse: UserRepositoryResponse

    class CreateTransactionRepositoryStub {
        async execute(
            _params: CreateTransactionParams,
        ): Promise<TransactionPublicResponse> {
            return Promise.resolve(validCreateTransactionResponse)
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(_userId: string): Promise<UserRepositoryResponse | null> {
            return Promise.resolve(validGetUserByIdRepositoryResponse)
        }
    }

    class IdGeneratorAdapterStub {
        execute(): string {
            return validCreateTransactionResponse.id
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

        validCreateTransactionResponse = {
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

    describe('success', () => {
      it('should create transaction successfully', async () => {
        // act
        const response = await sut.execute(createTransactionParams)

        // assert
        expect(response).toBeTruthy()
        expect(response).toEqual(validCreateTransactionResponse)
      })
    })
})
