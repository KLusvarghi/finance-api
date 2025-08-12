import { faker } from '@faker-js/faker'
import {
    TransactionPublicResponse,
    TransactionRepositoryResponse,
    UpdateTransactionParams,
} from '@/shared'
import { Prisma } from '@prisma/client'
import { UpdateTransactionService } from './update-transaction'

describe('UpdateTransactionService', () => {
    let sut: UpdateTransactionService
    let updateTransactionRepository: UpdateTransactionRepositoryStub
    let validTransactionRepositoryResponse: TransactionRepositoryResponse
    let validTransactionServiceResponse: TransactionPublicResponse
    let validUpdateTransactionParams: UpdateTransactionParams
    let validTransactionId: string

    class UpdateTransactionRepositoryStub {
        async execute(
            _transactionId: string,
            _params: UpdateTransactionParams,
        ): Promise<TransactionRepositoryResponse> {
            return Promise.resolve(validTransactionRepositoryResponse)
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        const sut = new UpdateTransactionService(updateTransactionRepository)

        return {
            sut,
            updateTransactionRepository,
        }
    }

    beforeEach(() => {
        const {
            sut: service,
            updateTransactionRepository: updateTransactionRepositoryStub,
        } = makeSut()

        sut = service
        updateTransactionRepository = updateTransactionRepositoryStub

        validTransactionId = faker.string.uuid()

        validUpdateTransactionParams = {
            name: faker.lorem.words(3),
            amount: faker.number.int({ min: 1, max: 1000 }),
            date: faker.date.recent().toISOString(),
            type: faker.helpers.arrayElement([
                'EARNING',
                'EXPENSE',
                'INVESTMENT',
            ]),
        }

        validTransactionRepositoryResponse = {
            id: validTransactionId,
            user_id: faker.string.uuid(),
            name: validUpdateTransactionParams.name || '',
            amount: new Prisma.Decimal(
                validUpdateTransactionParams.amount || 0,
            ),
            date: new Date(validUpdateTransactionParams.date || ''),
            type: validUpdateTransactionParams.type as Prisma.TransactionGetPayload<{}>['type'],
        }

        validTransactionServiceResponse = {
            id: validTransactionId,
            user_id: validTransactionRepositoryResponse.user_id,
            name: validTransactionRepositoryResponse.name,
            amount: validTransactionRepositoryResponse.amount,
            date: validTransactionRepositoryResponse.date,
            type: validTransactionRepositoryResponse.type,
        }
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })

    describe('success', () => {
        it('should update transaction successfully', async () => {
            // act
            const response = await sut.execute(validTransactionId, validUpdateTransactionParams)

            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual(validTransactionServiceResponse)
        })
    })

    describe('validations', () => {
      it('should call UpdateTransactionRepository with correct params', async () => {
        // arrange
        const updateTransactionRepositorySpy = jest.spyOn(updateTransactionRepository, 'execute')

        // act
        await sut.execute(validTransactionId, validUpdateTransactionParams)

        // assert
        expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(validTransactionId, validUpdateTransactionParams)
        expect(updateTransactionRepositorySpy).toHaveBeenCalledTimes(1)
      })
    })
})
