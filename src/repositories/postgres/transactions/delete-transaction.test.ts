import { createTestTransaction, createTestUser, transactionId } from '@/test'
import { PostgresDeleteTransactionRepository } from './delete-transaction'
import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { TransactionNotFoundError } from '@/errors'

describe('PostgresDeleteTransactionRepository', () => {
    let sut = new PostgresDeleteTransactionRepository()

    describe('error handling', () => {
        it('should throw an error if Prisma throws', async () => {
            // arrange
            jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(
                new Error('Prisma error'),
            )
            // act
            const promise = sut.execute(transactionId)

            // assert
            expect(promise).rejects.toThrow(new Error('Prisma error'))
        })

        it('should throw TransactionNotFoundError if transaction is not found', async () => {
            // arrange
            jest.spyOn(prisma.transaction, 'delete').mockRejectedValueOnce(
                new PrismaClientKnownRequestError('Transaction not found', {
                    code: 'P2025',
                    clientVersion: '0.0.0',
                }),
            )
            // act
            const promise = sut.execute(transactionId)

            // assert
            expect(promise).rejects.toThrow(
                new TransactionNotFoundError(transactionId),
            )
        })
    })

    describe('success', () => {
        it('should delete a transaction on database successfully', async () => {
            // arrange
            const user = await createTestUser()
            const transaction = await createTestTransaction({
                user_id: user.id,
            })

            // act
            const response = await sut.execute(transaction.id)

            // assert
            expect(response).not.toBeNull()
            expect(response?.name).toBe(transaction.name)
            expect(response?.type).toBe(transaction.type)
            expect(response?.user_id).toBe(transaction.user_id)
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
                user_id: user.id,
            })

            const prismaSpy = jest.spyOn(prisma.transaction, 'delete')

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
