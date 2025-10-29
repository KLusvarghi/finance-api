import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import dayjs from 'dayjs'

import { TransactionNotFoundError } from '@/errors'
import { PostgresDeleteTransactionRepository } from '@/repositories/postgres'
import { createTestTransaction, createTestUser, transactionId } from '@/test'

import { prisma } from '../../../../prisma/prisma'

describe('PostgresDeleteTransactionRepository', () => {
    const sut = new PostgresDeleteTransactionRepository()

    describe('error handling', () => {
        it('should throw TransactionNotFoundError if transaction is not found', async () => {
            jest.spyOn(prisma.transaction, 'delete').mockImplementationOnce(
                () => {
                    throw new PrismaClientKnownRequestError(
                        'Transaction not found',
                        {
                            code: 'P2025',
                            clientVersion: '0.0.0',
                        },
                    )
                },
            )

            const promise = sut.execute(transactionId)

            await expect(promise).rejects.toBeInstanceOf(
                TransactionNotFoundError,
            )
        })

        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute(transactionId)

            // assert
            await expect(promise).rejects.toThrow(new Error('Prisma error'))
        })
    })

    describe('success', () => {
        it('should delete a transaction on database successfully', async () => {
            // arrange
            const user = await createTestUser()
            const transaction = await createTestTransaction({
                userId: user.id,
            })

            // act
            const response = await sut.execute(transaction.id)

            // assert
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

            const prismaSpy = jest.spyOn(prisma.transaction, 'delete')

            // act
            await sut.execute(transaction.id)

            // assert
            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    id: transaction.id,
                    deletedAt: null,
                },
            })
        })
    })
})
