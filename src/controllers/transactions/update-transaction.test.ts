import {
    TransactionRepositoryResponse,
    UpdateTransactionParams,
} from '@/shared'
import { UpdateTransactionController } from './update-transaction'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import { invalidUUID } from '@/test/fixtures'

describe('UpdateTransactionController', () => {
    let sut: UpdateTransactionController
    let updateTransactionService: UpdateTransactionServiceStub
    let validTransactionId: string
    let validUpdateData: UpdateTransactionParams
    let validUpdateResponse: TransactionRepositoryResponse

    class UpdateTransactionServiceStub {
        execute(
            transactionId: string,
            _params: UpdateTransactionParams,
        ): Promise<TransactionRepositoryResponse> {
            return Promise.resolve({
                id: transactionId,
                user_id: faker.string.uuid(),
                name: faker.commerce.productName(),
                amount: new Prisma.Decimal(Number(faker.finance.amount())),
                date: faker.date.anytime(),
                type: 'EARNING',
            })
        }
    }

    const makeSut = () => {
        const updateTransactionService = new UpdateTransactionServiceStub()
        const sut = new UpdateTransactionController(updateTransactionService)

        return { sut, updateTransactionService }
    }

    beforeEach(() => {
        validTransactionId = faker.string.uuid()
        validUpdateData = {
            name: faker.commerce.productName(),
            amount: Number(faker.finance.amount()),
            date: faker.date.anytime().toISOString(),
            type: 'EARNING',
        }
        validUpdateResponse = {
            id: validTransactionId,
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            amount: new Prisma.Decimal(Number(faker.finance.amount())),
            date: faker.date.anytime(),
            type: 'EARNING',
        }

        const { sut: controller, updateTransactionService: service } = makeSut()
        sut = controller
        updateTransactionService = service
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('success cases', () => {
        it('should return 200 when updating transaction successfully', async () => {
            // act
            const response = await sut.execute({
                params: { transactionId: validTransactionId },
                body: validUpdateData,
            })

            const data = response.body?.data

            // assert
            expect(response.statusCode).toBe(200)
            expect(data).toMatchObject({
                id: validTransactionId,
                type: 'EARNING',
            })

            // Verificar se campos dinâmicos existem e têm tipos corretos
            expect(typeof data?.name).toBe('string')
            expect(data?.amount).toBeDefined()
            expect(data?.date).toBeInstanceOf(Date)
            expect(typeof data?.user_id).toBe('string')
        })
    })
    describe('validations', () => {
        it('should return 400 when transactionId is not provided', async () => {
            // act
            const response = await sut.execute({
                params: { transactionId: undefined },
                body: validUpdateData,
            })

            // assert
            expect(response.statusCode).toBe(400)
            expect(response.body?.message).toBe(
                'The field transactionId is required.',
            )
        })

        it.each(invalidUUID)(
            'should return 400 if trnasactionId is $description',
            async ({ id }) => {
                // act
                const response = await sut.execute({
                    params: { transactionId: id },
                    body: validUpdateData,
                })

                // assert
                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBe(
                    'The provider id is not valid.',
                )
            },
        )
    })
})
