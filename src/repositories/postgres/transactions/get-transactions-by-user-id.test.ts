import dayjs from 'dayjs'

import { prisma } from '../../../../prisma/prisma'

import { PostgresGetTransactionsByUserIdRepository } from '@/repositories/postgres'
import { createTestTransaction, createTestUser } from '@/test'

describe('PostgresGetTransactionsByUserIdRepository', () => {
    const sut = new PostgresGetTransactionsByUserIdRepository()

    const from = '2025-01-01'
    const to = '2025-01-31'

    describe('error handling', () => {
        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.transaction, 'findMany').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute('any_user_id', from, to)
            expect(promise).rejects.toThrow(new Error('Prisma error'))
        })
    })

    describe('success', () => {
        it('should get transactions by user id on database', async () => {
            const user = await createTestUser()
            const transaction = await createTestTransaction({
                userId: user.id,
            })

            const from = transaction.date.toISOString().split('T')[0]
            const to = transaction.date.toISOString().split('T')[0]

            const response = await sut.execute(user.id, from, to)

            expect(response.transactions.length).toBe(1)
            expect(response.nextCursor).toBeNull()
            expect(response.transactions[0]).not.toBeNull()
            expect(response.transactions[0].name).toBe(transaction.name)
            expect(response.transactions[0].type).toBe(transaction.type)
            expect(response.transactions[0].userId).toBe(user.id)
            expect(String(response.transactions[0].amount)).toBe(
                String(transaction.amount),
            )
            expect(dayjs(response.transactions[0].date).daysInMonth()).toBe(
                dayjs(transaction.date).daysInMonth(),
            )
            expect(dayjs(response.transactions[0].date).month()).toBe(
                dayjs(transaction.date).month(),
            )
            expect(dayjs(response.transactions[0].date).year()).toBe(
                dayjs(transaction.date).year(),
            )
        })
    })
    describe('validations', () => {
        it('should call Prisma with correct params', async () => {
            // arrange
            const user = await createTestUser()

            const prismaSpy = jest.spyOn(prisma.transaction, 'findMany')

            // act
            await sut.execute(user.id, from, to)

            // assert
            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    userId: user.id,
                    date: {
                        gte: new Date(from),
                        lte: new Date(to),
                    },
                },
                take: 21,
                orderBy: [{ date: 'desc' }, { id: 'asc' }],
            })
        })

        it('should return empty paginated response if user has no transactions', async () => {
            // arrange
            const user = await createTestUser()

            // act
            const response = await sut.execute(user.id, from, to)

            // assert
            expect(response).toEqual({
                transactions: [],
                nextCursor: null,
            })
        })
    })
})
