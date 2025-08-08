import { TransactionRepositoryResponse } from '@/shared'
import { DeleteTransactionController } from './delete-transaction'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'

describe('DeleteTransactionController', () => {
    let sut: DeleteTransactionController
    let deleteTransactionService: DeleteTransactionServiceStub
    let validTransactionId: string
    let validTransactionData: TransactionRepositoryResponse

    class DeleteTransactionServiceStub {
        execute(transactionId: string): Promise<TransactionRepositoryResponse> {
            return Promise.resolve(validTransactionData)
        }
    }

    const makeSut = () => {
        const deleteTransactionService = new DeleteTransactionServiceStub()
        const sut = new DeleteTransactionController(deleteTransactionService)

        return { deleteTransactionService, sut }
    }

    beforeEach(() => {
        validTransactionId = faker.string.uuid()

        validTransactionData = {
            id: validTransactionId,
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            amount: new Prisma.Decimal(Number(faker.finance.amount())),
            date: faker.date.anytime(),
            type: 'EARNING',
        }

        const { sut: controller, deleteTransactionService: service } = makeSut()
        sut = controller
        deleteTransactionService = service
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('success cases', () => {
        it('should return 200 when deleting transaction successfully', async () => {
            // act
            const response = await sut.execute({
                params: {
                    transactionId: validTransactionId,
                },
            })

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.status).toBe('success')
            expect(response.body?.message).toBe(
                'Transaction deleted successfully',
            )
            expect(response.body?.data).toEqual(validTransactionData)
        })
    })
})
