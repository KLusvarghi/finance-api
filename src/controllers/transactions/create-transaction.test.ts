import { mock, MockProxy } from 'jest-mock-extended'

import { ITransactionCacheManager } from '@/adapters'
import { CreateTransactionController } from '@/controllers'
import { CreateTransactionService } from '@/services'
import { HttpResponseSuccessBody } from '@/shared'
import {
    createTransactionControllerResponse,
    createTransactionHttpRequest as baseHttpRequest,
} from '@/test'

describe('CreateTransactionController', () => {
    let sut: CreateTransactionController
    let createTransactionService: MockProxy<CreateTransactionService>
    let transactionCacheManager: MockProxy<ITransactionCacheManager>

    beforeEach(() => {
        createTransactionService = mock<CreateTransactionService>()
        transactionCacheManager = mock<ITransactionCacheManager>()
        sut = new CreateTransactionController(
            createTransactionService,
            transactionCacheManager,
        )

        // Happy path setup - configure success scenario by default
        createTransactionService.execute.mockResolvedValue(
            createTransactionControllerResponse,
        )
    })

    describe('error handling', () => {
        it('should throw generic error when CreateTransactionService throws generic error', async () => {
            // arrange
            const genericError = new Error('Database connection failed')
            createTransactionService.execute.mockRejectedValue(genericError)

            // act & assert
            await expect(sut.execute(baseHttpRequest)).rejects.toThrow(
                genericError,
            )
        })
    })

    describe('success cases', () => {
        it('should return 201 when creating transaction successfully', async () => {
            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(201)
            expect(response.body?.success).toBe(true)
            expect((response.body as HttpResponseSuccessBody)?.data).toEqual(
                createTransactionControllerResponse,
            )
        })
    })

    describe('service integration', () => {
        it('should call CreateTransactionService with correct parameters', async () => {
            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(createTransactionService.execute).toHaveBeenCalledWith({
                ...baseHttpRequest.body,
                userId: baseHttpRequest.headers.userId,
            })
            expect(createTransactionService.execute).toHaveBeenCalledTimes(1)
        })
    })

    describe('cache management', () => {
        it('should invalidate cache after successful transaction creation', async () => {
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
