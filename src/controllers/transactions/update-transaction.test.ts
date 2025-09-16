import { mock, MockProxy } from 'jest-mock-extended'

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

    beforeEach(() => {
        // Setup executado antes de cada teste
        updateTransactionService = mock<UpdateTransactionService>()
        sut = new UpdateTransactionController(updateTransactionService)
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
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
            // arrange
            updateTransactionService.execute.mockResolvedValueOnce(
                updateTransactionControllerResponse,
            )

            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.success).toBe(true)
            expect(
                (response.body as HttpResponseSuccessBody)?.data,
            ).toMatchObject(updateTransactionControllerResponse)
        })

        it('should call UpdateTransactionService with correct params', async () => {
            // arrange
            updateTransactionService.execute.mockResolvedValueOnce(
                updateTransactionControllerResponse,
            )

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
})
