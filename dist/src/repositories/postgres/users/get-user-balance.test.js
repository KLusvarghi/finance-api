import { prisma } from '../../../../prisma/prisma'
import { PostgresGetUserBalanceRepository } from '@/repositories/postgres'
import {
    createTestUser,
    createUserRepositoryResponse as fakeUser,
} from '@/test'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'
describe('PostgresGetUserBalanceRepository', () => {
    const sut = new PostgresGetUserBalanceRepository()
    afterEach(() => {
        jest.restoreAllMocks()
    })
    describe('error handling', () => {
        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.transaction, 'aggregate').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute(fakeUser.id)
            expect(promise).rejects.toThrow(new Error('Prisma error'))
        })
    })
    describe('success', () => {
        it('should get user balance on database successfully', async () => {
            const from = new Date('2024-01-01')
            const to = new Date('2024-01-31')
            // precisamos criar um usuário antes de querer deletar
            await createTestUser()
            await prisma.transaction.createMany({
                data: [
                    {
                        name: faker.string.sample(),
                        amount: 5000,
                        date: new Date(from),
                        type: 'EARNING',
                        user_id: fakeUser.id,
                    },
                    {
                        name: faker.string.sample(),
                        date: new Date(from),
                        amount: 5000,
                        type: 'EARNING',
                        user_id: fakeUser.id,
                    },
                    {
                        name: faker.string.sample(),
                        date: new Date(from),
                        amount: 1000,
                        type: 'EXPENSE',
                        user_id: fakeUser.id,
                    },
                    {
                        name: faker.string.sample(),
                        date: new Date(to),
                        amount: 1000,
                        type: 'EXPENSE',
                        user_id: fakeUser.id,
                    },
                    {
                        name: faker.string.sample(),
                        date: new Date(to),
                        amount: 3000,
                        type: 'INVESTMENT',
                        user_id: fakeUser.id,
                    },
                    {
                        name: faker.string.sample(),
                        date: new Date(to),
                        amount: 3000,
                        type: 'INVESTMENT',
                        user_id: fakeUser.id,
                    },
                ],
            })
            const response = await sut.execute(fakeUser.id)
            expect(response.earnings.toString()).toBe('10000')
            expect(response.expenses.toString()).toBe('2000')
            expect(response.investments.toString()).toBe('6000')
            expect(response.balance.toString()).toBe('2000')
        })
    })
    describe('validations', () => {
        it('should call Prisma with correct params', async () => {
            // arrange
            // monitoramos o metodo "aggregate" do prisma
            const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate')
            // act
            await sut.execute(fakeUser.id)
            // assert
            expect(prismaSpy).toHaveBeenCalledTimes(3)
            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    user_id: fakeUser.id,
                    type: TransactionType.EXPENSE,
                },
                _sum: {
                    amount: true,
                },
            })
            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    user_id: fakeUser.id,
                    type: TransactionType.EARNING,
                },
                _sum: {
                    amount: true,
                },
            })
            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    user_id: fakeUser.id,
                    type: TransactionType.INVESTMENT,
                },
                _sum: {
                    amount: true,
                },
            })
        })
    })
})
//# sourceMappingURL=get-user-balance.test.js.map
