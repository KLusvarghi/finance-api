import { createUserRepositoryResponse as user } from '@/test'
import { PostgresGetUserBalanceRepository } from './get-user-balance'
import { prisma } from '../../../../prisma/prisma'
import { faker } from '@faker-js/faker'

describe('PostgresGetUserBalanceRepository', () => {
    let sut = new PostgresGetUserBalanceRepository()

    describe('success', () => {
        it('should get user balance on database successfully', async () => {
            const from = new Date('2024-01-01')
            const to = new Date('2024-01-31')
            // precisamos criar um usuário antes de querer deletar
            await prisma.user.create({
                data: user,
            })

            await prisma.transaction.createMany({
                data: [
                    {
                        name: faker.string.sample(),
                        amount: 5000,
                        date: new Date(from),
                        type: 'EARNING',
                        user_id: user.id,
                    },
                    {
                        name: faker.string.sample(),
                        date: new Date(from),
                        amount: 5000,
                        type: 'EARNING',
                        user_id: user.id,
                    },
                    {
                        name: faker.string.sample(),
                        date: new Date(from),
                        amount: 1000,
                        type: 'EXPENSE',
                        user_id: user.id,
                    },
                    {
                        name: faker.string.sample(),
                        date: new Date(to),
                        amount: 1000,
                        type: 'EXPENSE',
                        user_id: user.id,
                    },
                    {
                        name: faker.string.sample(),
                        date: new Date(to),
                        amount: 3000,
                        type: 'INVESTMENT',
                        user_id: user.id,
                    },
                    {
                        name: faker.string.sample(),
                        date: new Date(to),
                        amount: 3000,
                        type: 'INVESTMENT',
                        user_id: user.id,
                    },
                ],
            })

            const response = await sut.execute(user.id)
            expect(response.earnings.toString()).toBe('10000')
            expect(response.expenses.toString()).toBe('2000')
            expect(response.investments.toString()).toBe('6000')
            // expect(response.balance.toString()).toBe('2000')
        })
    })

    describe('validations', () => {})
})
