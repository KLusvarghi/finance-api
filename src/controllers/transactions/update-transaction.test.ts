import { mock, MockProxy } from 'jest-mock-extended'

import { ITransactionCacheManager } from '@/adapters'
import { UpdateTransactionController } from '@/controllers'
import { UpdateTransactionService } from '@/services'
import { HttpResponseSuccessBody } from '@/shared'
import {
    updateTransactionControllerResponse,
    updateTransactionHttpRequest as baseHttpRequest,
} from '@/test'

describe('UpdateTransactionController', () => {
    let sut: UpdateTransactionController
    let updateTransactionService: MockProxy<UpdateTransactionService>
    let transactionCacheManager: MockProxy<ITransactionCacheManager>

    beforeEach(() => {
        updateTransactionService = mock<UpdateTransactionService>()
        transactionCacheManager = mock<ITransactionCacheManager>()
        sut = new UpdateTransactionController(
            updateTransactionService,
            transactionCacheManager,
        )

        // Happy path setup - configure success scenario by default
        updateTransactionService.execute.mockResolvedValue(
            updateTransactionControllerResponse,
        )
    })

    describe('error handling', () => {
        it('should throw generic error when UpdateTransactionService throws generic error', async () => {
            // arrange
            const genericError = new Error('Database connection failed')
            updateTransactionService.execute.mockRejectedValue(genericError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                genericError,
            )
        })
    })

    describe('success cases', () => {
        it('should return 200 when updating transaction successfully', async () => {
            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.success).toBe(true)
            expect(
                (response.body as HttpResponseSuccessBody)?.data,
            ).toMatchObject(updateTransactionControllerResponse)
        })
    })

    describe('service integration', () => {
        it('should call UpdateTransactionService with correct params', async () => {
            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(updateTransactionService.execute).toHaveBeenCalledWith(
                baseHttpRequest.params.transactionId,
                {
                    ...baseHttpRequest.body,
                    userId: baseHttpRequest.headers.userId,
                },
            )
            expect(updateTransactionService.execute).toHaveBeenCalledTimes(1)
        })
    })

    describe('cache management', () => {
        it('should invalidate cache after successful transaction update', async () => {
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
