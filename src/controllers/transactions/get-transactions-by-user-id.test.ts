import { HttpRequest, TransactionRepositoryResponse } from '@/shared'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import { invalidUUID } from '@/test/fixtures'
import { UserNotFoundError } from '@/errors/user'

describe('GetTransactionsByUserIdController', () => {
    let sut: GetTransactionsByUserIdController
    let getTransactionByUserIdService: GetTransactionsByUserIdServiceStub
    let validUserId: string
    let validTransactionData: TransactionRepositoryResponse[]
    let baseHttpRequest: HttpRequest

    class GetTransactionsByUserIdServiceStub {
        execute(_userId: string): Promise<TransactionRepositoryResponse[]> {
            return Promise.resolve(validTransactionData)
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

        validUserId = faker.string.uuid()

        validTransactionData = [
            {
                id: faker.string.uuid(),
                user_id: validUserId,
                name: faker.commerce.productName(),
                amount: new Prisma.Decimal(Number(faker.finance.amount())),
                date: faker.date.anytime(),
                type: 'EARNING',
            },
        ]

        baseHttpRequest = {
            query: {
                userId: validUserId,
            },
        }
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
            expect(response.body?.message).toBe('Internal server error')
        })

        it('should return 404 if GetTransactionsByUserIdService throws UserNotFoundError', async () => {
            // arrange
            jest.spyOn(
                getTransactionByUserIdService,
                'execute',
            ).mockRejectedValueOnce(new UserNotFoundError(validUserId))
            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(404)
            expect(response.body?.message).toBe(
                `User with id ${validUserId} not found`,
            )
        })
    })

    describe('validations', () => {
        it('should return 400 when userId is not provided', async () => {
            // act
            const response = await sut.execute({ query: { userId: undefined } })

            // assert
            expect(response.statusCode).toBe(400)
            expect(response.body?.message).toBe('The field userId is required.')
        })

        it.each(invalidUUID)(
            'should return 400 when userId is $description',
            async ({ id }) => {
                // act
                const response = await sut.execute({
                    query: { userId: id },
                })

                // assert
                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBe(
                    'The provider id is not valid.',
                )
            },
        )
    })

    describe('success cases', () => {
        it('should return 200 when finding transactions by user id', async () => {
            // act
            const response = await sut.execute(baseHttpRequest)

            // assert
            expect(response.statusCode).toBe(200)
            expect(response.body?.data).toEqual(validTransactionData)
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
                baseHttpRequest.query.userId,
            )
            expect(executeSpy).toHaveBeenCalledTimes(1)
        })
    })
})
