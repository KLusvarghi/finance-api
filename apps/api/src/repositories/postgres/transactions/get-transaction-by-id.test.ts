import dayjs from 'dayjs'

import { PostgresGetTransactionByIdRepository } from '@/repositories/postgres'
import { createTestTransaction, createTestUser } from '@/test'

import { prisma } from '../../../../prisma/prisma'

describe('PostgresGetTransactionByIdRepository', () => {
    const sut = new PostgresGetTransactionByIdRepository()

    describe('error handling', () => {
        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.transaction, 'findUnique').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute('any_transaction_id')
            await expect(promise).rejects.toThrow(new Error('Prisma error'))
        })

        it('should return null if transaction is not found', async () => {
            // arrange
            jest.spyOn(prisma.transaction, 'findUnique').mockResolvedValueOnce(
                null,
            )

            // act
            const response = await sut.execute('any_transaction_id')

            // assert
            expect(response).toBeNull()
        })
    })

    describe('success', () => {
        it('should get transaction by id on database', async () => {
            const user = await createTestUser()

            const transaction = await createTestTransaction({
                userId: user.id,
            })

            const response = await sut.execute(transaction.id)

            expect(response).not.toBeNull()
            expect(response?.name).toBe(transaction.name)
            expect(response?.type).toBe(transaction.type)
            expect(response?.userId).toBe(transaction.userId)
            expect(String(response?.amount)).toBe(String(transaction.amount))
            expect(dayjs(response?.date).daysInMonth()).toBe(
                dayjs(transaction.date).daysInMonth(),
            )
            expect(dayjs(response?.date).month()).toBe(
                dayjs(transaction.date).month(),
            )
            expect(dayjs(response?.date).year()).toBe(
                dayjs(transaction.date).year(),
            )
        })
    })
    describe('validations', () => {
        it('should call Prisma with correct params', async () => {
            // arrange
            const user = await createTestUser()
            const transaction = await createTestTransaction({
                userId: user.id,
            })
            const prismaSpy = jest.spyOn(prisma.transaction, 'findUnique')

            // act
            await sut.execute(transaction.id)

            // assert
            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    id: transaction.id,
                },
            })
        })
    })
})
