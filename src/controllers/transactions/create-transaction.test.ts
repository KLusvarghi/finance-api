import {
    CreateTransactionParams,
    TransactionRepositoryResponse,
} from '@/shared'
import { CreateTransactionController } from './create-transaction'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import { invalidUUID } from '@/test/fixtures/transactions'

describe('CreateTransactionController', () => {
    let sut: CreateTransactionController
    let createTransactionService: CreateTransactionServiceStub
    let validTransactionData: any

    class CreateTransactionServiceStub {
        async execute(
            _transaction: CreateTransactionParams,
        ): Promise<TransactionRepositoryResponse> {
            return Promise.resolve({
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name: faker.commerce.productName(),
                amount: new Prisma.Decimal(Number(faker.finance.amount())),
                date: faker.date.anytime(),
                type: faker.helpers.arrayElement([
                    'EARNING',
                    'EXPENSE',
                    'INVESTMENT',
                ]),
            })
        }
    }

    const makeSut = () => {
        const createTransactionService = new CreateTransactionServiceStub()
        const sut = new CreateTransactionController(createTransactionService)
        return { createTransactionService, sut }
    }

    beforeEach(() => {
        // Setup executado antes de cada teste, tendo que especificar o que cada um é, controller e service
        const { sut: controller, createTransactionService: service } = makeSut()
        sut = controller
        createTransactionService = service

        // Dados válidos sempre disponíveis
        validTransactionData = {
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            // Tendo que definir corretamente o tipo do date, pois o faker.date.anytime() retorna um objeto Date e não uma string
            date: faker.date.anytime().toISOString(),
            // type: 'EARNING',
            type: faker.helpers.arrayElement([
                'EARNING',
                'EXPENSE',
                'INVESTMENT',
            ]),
            amount: Number(faker.finance.amount()),
            // amount: new Prisma.Decimal(
            //     faker.number.float({ min: 1, max: 1000 }),
            // ),
        }
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('succes cases', () => {
        it('should return 201 when creating transaction successfully', async () => {
            // arrange
            const result = await sut.execute({ body: validTransactionData })

            // assert
            expect(result.statusCode).toBe(201)
            expect(result.body?.status).toBe('success')
            // expect(result.body?.data).toMatchObject(validTransactionData)
        })

        it('should call CreateTransactionService with correct parameters', async () => {
            // arrange
            const spy = jest.spyOn(createTransactionService, 'execute')

            // act
            await sut.execute({ body: validTransactionData })

            // assert
            expect(spy).toHaveBeenCalledWith(validTransactionData)
            expect(spy).toHaveBeenCalledTimes(1)
        })
    })

    describe('validations', () => {
        describe('user_id', () => {
            it('should return 400 if user_id is not provided', async () => {
                // arrange
                const result = await sut.execute({
                    body: {
                        ...validTransactionData,
                        user_id: undefined,
                    },
                })

                // assaert
                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
                // expect(result.body?.message).toBeTruthy()
            })

            it.each(invalidUUID)(
              'should return 400 if user_id is $description',
              async ({ id }) => {
                  // arrange
                  const result = await sut.execute({
                      body: {
                          ...validTransactionData,
                          user_id: id,
                      },
                  })

                  // assert
                  expect(result.statusCode).toBe(400)
                  expect(result.body?.status).toBe('error')
                  expect(result.body?.message).toBe(
                      'User id must be a valid uuid',
                  )
              },
          )

            it('should return 400 if user_id is an empty string', async () => {
                // arrange
                const result = await sut.execute({
                    body: {
                        ...validTransactionData,
                        user_id: '',
                    },
                })

                // assert
                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
            })

            it('should return 400 if user_id is null', async () => {
                // arrange
                const result = await sut.execute({
                    body: {
                        ...validTransactionData,
                        user_id: null,
                    },
                })

                // assert
                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
            })

            it('should return 400 if user_id is a number', async () => {
                // arrange
                const result = await sut.execute({
                    body: {
                        ...validTransactionData,
                        user_id: 123,
                    },
                })

                // assert
                expect(result.statusCode).toBe(400)
                expect(result.body?.status).toBe('error')
            })

            
        })
    })
})
