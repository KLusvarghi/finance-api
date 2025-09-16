import { mock, MockProxy } from 'jest-mock-extended'

import { DeleteTransactionController } from '@/controllers'
import { TransactionNotFoundError } from '@/errors'
import { DeleteTransactionService } from '@/services'
import { HttpResponseSuccessBody, ResponseMessage } from '@/shared'
import {
    deleteTransactionControllerResponse,
    deleteTransactionHttpRequest as baseHttpRequest,
    transactionId,
} from '@/test'

describe('DeleteTransactionController', () => {
    let sut: DeleteTransactionController
    let deleteTransactionService: MockProxy<DeleteTransactionService>

    beforeEach(() => {
        // Setup executado antes de cada teste
        deleteTransactionService = mock<DeleteTransactionService>()
        sut = new DeleteTransactionController(deleteTransactionService)
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('error handling', () => {
        it('should throw generic error when DeleteTransactionService throws generic error', async () => {
            // arrange
            const genericError = new Error('Database connection failed')
            deleteTransactionService.execute.mockRejectedValue(genericError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                genericError,
            )
        })

        it('should throw TransactionNotFoundError when DeleteTransactionService throws it', async () => {
            // arrange
            const transactionNotFoundError = new TransactionNotFoundError(
                transactionId,
            )
            deleteTransactionService.execute.mockRejectedValue(
                transactionNotFoundError,
            )

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                TransactionNotFoundError,
            )
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                `Transaction with id ${transactionId} not found`,
            )
        })
    })

    describe('success cases', () => {
        it('should return 200 when deleting transaction successfully', async () => {
            // arrange
            deleteTransactionService.execute.mockResolvedValueOnce(
                deleteTransactionControllerResponse,
            )

            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.success).toBe(true)
            expect(response.body?.message).toBe(
                ResponseMessage.TRANSACTION_DELETED,
            )
            expect((response.body as HttpResponseSuccessBody)?.data).toEqual(
                deleteTransactionControllerResponse,
            )
        })

        it('should call DeleteTransactionService with correct parameters', async () => {
            // arrange
            deleteTransactionService.execute.mockResolvedValueOnce(
                deleteTransactionControllerResponse,
            )

            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(deleteTransactionService.execute).toHaveBeenCalledWith({
                transactionId: baseHttpRequest.params.transactionId,
                userId: baseHttpRequest.headers.userId,
            })
            expect(deleteTransactionService.execute).toHaveBeenCalledTimes(1)
        })
    })
})
