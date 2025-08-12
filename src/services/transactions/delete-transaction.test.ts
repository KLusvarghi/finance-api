import { faker } from '@faker-js/faker'
import { DeleteTransactionService } from './delete-transaction'
import {
    TransactionPublicResponse,
    TransactionRepositoryResponse,
} from '@/shared'
import { Prisma } from '@prisma/client'

describe('DeleteTransactionService', () => {
    let sut: DeleteTransactionService
    let deleteTransactionRepository: DeleteTransactionRepositoryStub
    let validTransactionRepositoryResponse: TransactionRepositoryResponse
    let validTransactionServiceResponse: TransactionPublicResponse
    let validTransactionId: string

    class DeleteTransactionRepositoryStub {
        async execute(
            _id: string,
        ): Promise<TransactionRepositoryResponse | null> {
            return Promise.resolve(validTransactionRepositoryResponse)
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionService(deleteTransactionRepository)

        return {
            sut,
            deleteTransactionRepository,
        }
    }

    beforeEach(() => {
        const {
            sut: service,
            deleteTransactionRepository: deleteTransactionRepositoryStub,
        } = makeSut()

        sut = service
        deleteTransactionRepository = deleteTransactionRepositoryStub

        validTransactionId = faker.string.uuid()

        validTransactionRepositoryResponse = {
            id: validTransactionId,
            user_id: faker.string.uuid(),
            name: faker.lorem.words(3),
            amount: new Prisma.Decimal(faker.number.int({ min: 1, max: 1000 })),
            date: faker.date.recent(),
            type: faker.helpers.arrayElement([
                'EARNING',
                'EXPENSE',
                'INVESTMENT',
            ]),
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
      it('should delete transaction successfully', async () => {
        // act
        const response = await sut.execute(validTransactionId)

        // assert
        expect(response).toEqual(validTransactionServiceResponse)
      })
    })

    describe('validation', () => {
      it('should call DeleteTransactionRepository with correct params', async () => {
        // arrange
        const deleteTransactionRepositorySpy = jest.spyOn(deleteTransactionRepository, 'execute')

        // act
        await sut.execute(validTransactionId)

        // assert
        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(validTransactionId)
        expect(deleteTransactionRepositorySpy).toHaveBeenCalledTimes(1)
      })
    })
})
