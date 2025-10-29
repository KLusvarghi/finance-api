import dayjs from 'dayjs'

import { PostgresCreateTransactionRepository } from '@/repositories/postgres'
import {
    createTestUser,
    createTransactionParams,
    createTransactionRepositoryResponse as fakeTransaction,
    transactionId,
} from '@/test'

import { prisma } from '../../../../prisma/prisma'

describe('PostgresCreateTransactionRepository', () => {
    const sut = new PostgresCreateTransactionRepository()

    describe('error handling', () => {
        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.transaction, 'create').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute({
                ...fakeTransaction,
                amount: Number(fakeTransaction.amount),
                date: fakeTransaction.date.toISOString(),
            })
            await expect(promise).rejects.toThrow(new Error('Prisma error'))
        })
    })

    describe('success', () => {
        it('should create a transaction on database', async () => {
            const user = await createTestUser()

            const response = await sut.execute({
                ...createTransactionParams,
                userId: user.id,
                id: transactionId,
            })

            expect(response).not.toBeNull()
            expect(response.name).toBe(createTransactionParams.name)
            expect(response.type).toBe(createTransactionParams.type)
            expect(response.userId).toBe(user.id)
            expect(String(response.amount)).toBe(
                String(createTransactionParams.amount),
            )
            expect(dayjs(response.date).daysInMonth()).toBe(
                dayjs(createTransactionParams.date).daysInMonth(),
            )
            expect(dayjs(response.date).month()).toBe(
                dayjs(createTransactionParams.date).month(),
            )
            expect(dayjs(response.date).year()).toBe(
                dayjs(createTransactionParams.date).year(),
            )
        })
    })

    describe('validations', () => {
        it('should call Prisma with correct params', async () => {
            const user = await createTestUser()

            const prismaSpy = jest.spyOn(prisma.transaction, 'create')
            await sut.execute({
                ...createTransactionParams,
                userId: user.id,
                id: transactionId,
            })
            expect(prismaSpy).toHaveBeenCalledWith({
                data: {
                    ...createTransactionParams,
                    userId: user.id,
                    id: transactionId,
                },
            })
        })
    })
})
