import { createTestTransaction, createTestUser } from '@/test'
import { PostgresGetTransactionsByUserIdRepository } from './get-transactions-by-user-id'
import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma'

describe('PostgresGetTransactionsByUserIdRepository', () => {
    let sut = new PostgresGetTransactionsByUserIdRepository()

    describe('error handling', () => {
        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.transaction, 'findMany').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute('any_user_id')
            expect(promise).rejects.toThrow(new Error('Prisma error'))
        })
    })

    describe('success', () => {
        it('should get transactions by user id on database', async () => {
            const user = await createTestUser()
            const transaction = await createTestTransaction({
                user_id: user.id,
            })

            const response = await sut.execute(user.id)

            expect(response?.length).toBe(1)
            expect(response?.[0]).not.toBeNull()
            expect(response?.[0].name).toBe(transaction.name)
            expect(response?.[0].type).toBe(transaction.type)
            expect(response?.[0].user_id).toBe(user.id)
            expect(String(response?.[0].amount)).toBe(
                String(transaction.amount),
            )
            expect(dayjs(response?.[0].date).daysInMonth()).toBe(
                dayjs(transaction.date).daysInMonth(),
            )
            expect(dayjs(response?.[0].date).month()).toBe(
                dayjs(transaction.date).month(),
            )
            expect(dayjs(response?.[0].date).year()).toBe(
                dayjs(transaction.date).year(),
            )
        })
    })
    describe('validations', () => {
        it('should call Prisma with correct params', async () => {
            // arrange
            const user = await createTestUser()
            const transaction = await createTestTransaction({
                user_id: user.id,
            })

            const prismaSpy = jest.spyOn(prisma.transaction, 'findMany')

            // act
            await sut.execute(user.id)

            // assert
            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    user_id: user.id,
                },
            })
        })
    })
})
