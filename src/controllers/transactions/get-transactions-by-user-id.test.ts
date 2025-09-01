import { GetTransactionsByUserIdController } from '@/controllers'
import { UserNotFoundError } from '@/errors'
import { ResponseMessage, TransactionPublicResponse } from '@/shared'
import {
    getTransactionsByUserIdControllerResponse,
    getTransactionsByUserIdHttpRequest as baseHttpRequest,
    userId,
} from '@/test'

describe('GetTransactionsByUserIdController', () => {
    let sut: GetTransactionsByUserIdController
    let getTransactionByUserIdService: GetTransactionsByUserIdServiceStub

    class GetTransactionsByUserIdServiceStub {
        execute(_userId: string): Promise<TransactionPublicResponse[]> {
            return Promise.resolve(getTransactionsByUserIdControllerResponse)
        }
    }

    const makeSut = () => {
        const getTransactionByUserIdService =
            new GetTransactionsByUserIdServiceStub()
        const sut = new GetTransactionsByUserIdController(
            getTransactionByUserIdService,
        )

        return { sut, getTransactionByUserIdService }
    }

    beforeEach(() => {
        const { sut: controller, getTransactionByUserIdService: service } =
            makeSut()

        sut = controller
        getTransactionByUserIdService = service
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('error handling', () => {
        it('should return 500 if GetTransactionsByUserIdService throws generic error', async () => {
            // arrange
            jest.spyOn(
                getTransactionByUserIdService,
                'execute',
            ).mockRejectedValueOnce(new Error())
            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(500)
            expect(response.body?.message).toBe(ResponseMessage.SERVER_ERROR)
        })

        it('should return 404 if GetTransactionsByUserIdService throws UserNotFoundError', async () => {
            // arrange
            jest.spyOn(
                getTransactionByUserIdService,
                'execute',
            ).mockRejectedValueOnce(new UserNotFoundError(userId))
            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(404)
            expect(response.body?.message).toBe(
                `User with id ${userId} not found`,
            )
        })
    })

    describe('success cases', () => {
        it('should return 200 when finding transactions by user id', async () => {
            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.data).toEqual(
                getTransactionsByUserIdControllerResponse,
            )
        })

        it('should call GetTransactionsByUserIdService with correct parameters', async () => {
            // arrange
            const executeSpy = jest.spyOn(
                getTransactionByUserIdService,
                'execute',
            )

            // act
            await sut.execute(baseHttpRequest)

            // assert
            expect(executeSpy).toHaveBeenCalledWith(
                baseHttpRequest.headers.userId,
            )
            expect(executeSpy).toHaveBeenCalledTimes(1)
        })
    })
})
