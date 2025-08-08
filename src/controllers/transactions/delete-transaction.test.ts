import { TransactionRepositoryResponse } from '@/shared'
import { DeleteTransactionController } from './delete-transaction'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import { invalidUUID } from '@/test/fixtures'
import { TransactionNotFoundError } from '@/errors/user'

describe('DeleteTransactionController', () => {
    let sut: DeleteTransactionController
    let deleteTransactionService: DeleteTransactionServiceStub
    let validTransactionId: string
    let validTransactionData: TransactionRepositoryResponse

    class DeleteTransactionServiceStub {
        execute(_transactionId: string): Promise<TransactionRepositoryResponse> {
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

    describe('validations', () => {
        it.each(invalidUUID)(
            'should return 400 if transactionId is $description',
            async ({ id }) => {
                // arrange
                const response = await sut.execute({
                    params: {
                        transactionId: id,
                    },
                })

                // assert
                expect(response.statusCode).toBe(400)
                expect(response.body?.status).toBe('error')
                expect(response.body?.message).toBe(
                    'The provider id is not valid.',
                )
            },
        )
    })
    describe('error handling', () => {
        it('should return 500 if DeleteTransactionService throws an error', async () => {
            // arrange
            jest.spyOn(
                deleteTransactionService,
                'execute',
            ).mockRejectedValueOnce(new Error())

            // act
            const response = await sut.execute({
                params: {
                    transactionId: validTransactionId,
                },
            })

            // assert
            expect(response.statusCode).toBe(500)
            expect(response.body?.status).toBe('error')
        })

        it('should return 404 if DeleteTransactionService throws TransactionNotFoundError', async () => {
            // arrange
            // sempre usamos o "mockRejectedValueOnce" quando queremos testar um erro específico, porque ele irá dar um throw 
            jest.spyOn(
                deleteTransactionService,
                'execute',
            ).mockRejectedValueOnce(
                new TransactionNotFoundError(validTransactionId),
            )

            // act
            const response = await sut.execute({
                params: {
                    transactionId: validTransactionId,
                },
            })

            // assert
            expect(response.statusCode).toBe(404)
            expect(response.body?.status).toBe('error')
            expect(response.body?.message).toBe(
                'Transaction not found.',
            )
        })
    })
})
