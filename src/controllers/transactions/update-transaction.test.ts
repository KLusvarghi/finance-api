import { UpdateTransactionController } from '@/controllers'
import {
    HttpResponseSuccessBody,
    TransactionPublicResponse,
    UpdateTransactionParams,
} from '@/shared'
import {
    updateTransactionControllerResponse,
    updateTransactionHttpRequest as baseHttpRequest,
} from '@/test'

describe('UpdateTransactionController', () => {
    let sut: UpdateTransactionController
    let updateTransactionService: UpdateTransactionServiceStub

    class UpdateTransactionServiceStub {
        execute(
            _transactionId: string,
            _params: UpdateTransactionParams,
        ): Promise<TransactionPublicResponse> {
            return Promise.resolve(updateTransactionControllerResponse)
        }
    }

    const makeSut = () => {
        const updateTransactionService = new UpdateTransactionServiceStub()
        const sut = new UpdateTransactionController(updateTransactionService)

        return { sut, updateTransactionService }
    }

    beforeEach(() => {
        const { sut: controller, updateTransactionService: service } = makeSut()

        sut = controller
        updateTransactionService = service
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('error handling', () => {
        it('should return 500 if UpdateTransactionService throws generic error', async () => {
            jest.spyOn(
                updateTransactionService,
                'execute',
            ).mockRejectedValueOnce(new Error())

            const response = await sut.execute({
                ...baseHttpRequest,
            })

            expect(response.statusCode).toBe(500)
        })
    })

    describe('success cases', () => {
        it('should return 200 when updating transaction successfully', async () => {
            // act
            const response = await sut.execute(baseHttpRequest)

            const data = (response.body as HttpResponseSuccessBody)?.data

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.success).toBe(true)
            expect(data).toMatchObject(updateTransactionControllerResponse)
        })

        it('should call UpdateTransactionService with correct params', async () => {
            const executeSpy = jest.spyOn(updateTransactionService, 'execute')

            await sut.execute(baseHttpRequest)

            expect(executeSpy).toHaveBeenCalledWith(
                baseHttpRequest.params.transactionId,
                {
                    ...baseHttpRequest.body,
                    userId: baseHttpRequest.headers.userId,
                },
            )
            // expect(executeSpy).toHaveBeenCalledTimes(1)
        })
    })
})
