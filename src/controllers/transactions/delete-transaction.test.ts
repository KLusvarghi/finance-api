import { DeleteTransactionController } from '@/controllers'
import { TransactionNotFoundError } from '@/errors'
import { ResponseMessage, TransactionRepositoryResponse } from '@/shared'
import {
    createInvalidIdCases,
    deleteTransactionControllerResponse,
    deleteTransactionHttpRequest as baseHttpRequest,
    transactionId,
} from '@/test'

describe('DeleteTransactionController', () => {
    let sut: DeleteTransactionController
    let deleteTransactionService: DeleteTransactionServiceStub

    class DeleteTransactionServiceStub {
        execute(
            _transactionId: string,
        ): Promise<TransactionRepositoryResponse> {
            return Promise.resolve(deleteTransactionControllerResponse)
        }
    }

    const makeSut = () => {
        const deleteTransactionService = new DeleteTransactionServiceStub()
        const sut = new DeleteTransactionController(deleteTransactionService)

        return { deleteTransactionService, sut }
    }

    beforeEach(() => {
        const { sut: controller, deleteTransactionService: service } = makeSut()

        sut = controller
        deleteTransactionService = service
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('error handling', () => {
        it('should return 500 if DeleteTransactionService throws an error', async () => {
            // arrange
            jest.spyOn(
                deleteTransactionService,
                'execute',
            ).mockRejectedValueOnce(new Error())

            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(500)
        })

        it('should return 404 if DeleteTransactionService throws TransactionNotFoundError', async () => {
            // arrange
            // sempre usamos o "mockRejectedValueOnce" quando queremos testar um erro específico, porque ele irá dar um throw
            jest.spyOn(
                deleteTransactionService,
                'execute',
            ).mockRejectedValueOnce(new TransactionNotFoundError(transactionId))

            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(404)
            expect(response.body?.message).toBe(
                `Transaction with id ${transactionId} not found`,
            )
        })
    })

    describe('validations', () => {
        const invalidIdCases = createInvalidIdCases({
            missing: ResponseMessage.TRANSACTION_ID_MISSING,
            invalid: ResponseMessage.TRANSACTION_INVALID_ID,
        })

        it.each(invalidIdCases)(
            'should return 400 if transactionId is $description',
            async ({ id, expectedMessage }) => {
                // arrange
                const response = await sut.execute({
                    params: {
                        transactionId: id,
                    },
                })

                // assert
                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBe(expectedMessage)
            },
        )
    })

    describe('success cases', () => {
        it('should return 200 when deleting transaction successfully', async () => {
            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.message).toBe(
                ResponseMessage.TRANSACTION_DELETED,
            )
            // expect(response.body?.data).toEqual(
            //     deleteTransactionControllerResponse,
            // )
        })

        it('should call DeleteTransactionService with correct parameters', async () => {
            // arrange
            const executeSpy = jest.spyOn(deleteTransactionService, 'execute')

            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(executeSpy).toHaveBeenCalledWith(
                baseHttpRequest.params.transactionId,
            )
            expect(executeSpy).toHaveBeenCalledTimes(1)
        })
    })
})
