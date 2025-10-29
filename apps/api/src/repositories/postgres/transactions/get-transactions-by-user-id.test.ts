import dayjs from 'dayjs'

import { PostgresGetTransactionsByUserIdRepository } from '@/repositories/postgres'
import { createTestTransaction, createTestUser } from '@/test'

import { prisma } from '../../../../prisma/prisma'

describe('PostgresGetTransactionsByUserIdRepository', () => {
    const sut = new PostgresGetTransactionsByUserIdRepository()

    const baseParams = {
        userId: 'any_user_id',
        from: new Date('2025-01-01'),
        to: new Date('2025-01-31'),
        limit: 20,
    }

    describe('error handling', () => {
        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.transaction, 'findMany').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute(baseParams)
            await expect(promise).rejects.toThrow(new Error('Prisma error'))
        })
    })

    describe('success', () => {
        it('should get transactions by user id on database', async () => {
            const user = await createTestUser()
            const transaction = await createTestTransaction({
                userId: user.id,
            })

            const params = {
                userId: user.id,
                from: new Date(transaction.date.toISOString().split('T')[0]),
                to: new Date(transaction.date.toISOString().split('T')[0]),
                limit: 20,
            }

            const response = await sut.execute(params)

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
            const params = {
                userId: user.id,
                from: baseParams.from,
                to: baseParams.to,
                limit: 20,
            }
            await sut.execute(params)

            // assert
            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    userId: user.id,
                    date: {
                        gte: baseParams.from,
                        lte: baseParams.to,
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
            const params = {
                userId: user.id,
                from: baseParams.from,
                to: baseParams.to,
                limit: 20,
            }
            const response = await sut.execute(params)

            // assert
            expect(response).toEqual({
                transactions: [],
                nextCursor: null,
            })
        })
    })
})
