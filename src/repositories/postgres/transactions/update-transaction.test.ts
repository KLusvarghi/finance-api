import dayjs from 'dayjs'

import { prisma } from '../../../../prisma/prisma'

import { TransactionNotFoundError } from '@/errors'
import { PostgresUpdateTransactionRepository } from '@/repositories/postgres'
import {
    createTestTransaction,
    createTestUser,
    updateTransactionParams as params,
    userId,
} from '@/test'
import {
    Decimal,
    PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library'

describe('PostgresUpdateTransactionRepository', () => {
    const sut = new PostgresUpdateTransactionRepository()

    describe('error handling', () => {
        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute('any_transaction_id', params)
            expect(promise).rejects.toThrow(new Error('Prisma error'))
        })

        it('should throw TransactionNotFoundError if transaction is not found', async () => {
            // arrange
            jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
                new PrismaClientKnownRequestError('Transaction not found', {
                    code: 'P2025',
                    clientVersion: '0.0.0',
                }),
            )
            // act
            const promise = sut.execute(userId, params)

            expect(promise).rejects.toBeInstanceOf(TransactionNotFoundError)
        })
    })

    describe('success', () => {
        it('should update a transaction on database successfully', async () => {
            const user = await createTestUser()
            const transaction = await createTestTransaction({
                ...params,
                amount: new Decimal(params.amount),
                date: new Date(params.date),
            })

            const response = await sut.execute(transaction.id, params)

            expect(response?.name).toBe(transaction.name)
            expect(response?.type).toBe(transaction.type)
            expect(response?.userId).toBe(user.id)
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

            const prismaSpy = jest.spyOn(prisma.transaction, 'update')

            // act
            await sut.execute(transaction.id, params)

            // assert
            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    id: transaction.id,
                    deletedAt: null,
                },
                data: params,
            })
        })
    })
})
