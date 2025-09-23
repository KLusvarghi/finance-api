import { mock, MockProxy } from 'jest-mock-extended'

import { ITransactionCacheManager } from '@/adapters'
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
    let transactionCacheManager: MockProxy<ITransactionCacheManager>

    beforeEach(() => {
        deleteTransactionService = mock<DeleteTransactionService>()
        transactionCacheManager = mock<ITransactionCacheManager>()
        sut = new DeleteTransactionController(
            deleteTransactionService,
            transactionCacheManager,
        )

        // Happy path setup - configure success scenario by default
        deleteTransactionService.execute.mockResolvedValue(
            deleteTransactionControllerResponse,
        )
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
    })

    describe('service integration', () => {
        it('should call DeleteTransactionService with correct parameters', async () => {
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

    describe('cache management', () => {
        it('should invalidate cache after successful transaction deletion', async () => {
            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(transactionCacheManager.invalidate).toHaveBeenCalledWith(
                baseHttpRequest.headers.userId,
            )
            expect(transactionCacheManager.invalidate).toHaveBeenCalledTimes(1)
        })
    })
})
