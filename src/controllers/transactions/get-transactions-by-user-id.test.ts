import { HttpRequest, TransactionRepositoryResponse } from "@/shared"
import { GetTransactionsByUserIdController } from "./get-transactions-by-user-id"
import { faker } from "@faker-js/faker"
import { Prisma } from "@prisma/client"
import { invalidUUID } from "@/test/fixtures"

describe('GetTransactionsByUserIdController', () => {
  let sut: GetTransactionsByUserIdController
  let getTransactionByUserIdService: GetTransactionsByUserIdServiceStub
  let validUserId: string
  let validTransactionData: TransactionRepositoryResponse[]

  class GetTransactionsByUserIdServiceStub {
    execute(userId: string): Promise<TransactionRepositoryResponse[]> {
      return Promise.resolve(validTransactionData)
    }
  }

  const makeSut = () => {
    const getTransactionByUserIdService = new GetTransactionsByUserIdServiceStub()
    const sut = new GetTransactionsByUserIdController(getTransactionByUserIdService)

    return { sut, getTransactionByUserIdService }
  }

  beforeEach(() => {
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

    const { sut: controller, getTransactionByUserIdService: service } = makeSut() 
    sut = controller
    getTransactionByUserIdService = service
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('success cases', () => {
    it('should return 200 when finding transactions by user id', async() => {
      // act
      const response = await sut.execute({ query: { userId: validUserId } })

      // assert
      expect(response.statusCode).toBe(200)
      expect(response.body?.data).toEqual(validTransactionData)
    })
  })
  describe('error cases', () => {
    it('should return 400 when userId is not provided', async() => {
      // act
      const response = await sut.execute({ query: { userId: undefined } })

      // assert
      expect(response.statusCode).toBe(400)
      expect(response.body?.message).toBe('The field userId is required.')
    })

    it.each(invalidUUID)(
      'should return 400 when userId is $description',
      async ({id}) => {
        const response = await sut.execute({
          query: { userId: id }
        })

        // assert
        expect(response.statusCode).toBe(400)
        expect(response.body?.message).toBe('The provider userId is required.')
      }
    )
  })
})
