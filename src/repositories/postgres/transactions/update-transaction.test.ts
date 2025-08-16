import {
    createTestTransaction,
    createTestUser,
    updateTransactionParams as params,
} from '@/test'
import { PostgresUpdateTransactionRepository } from './update-transaction'
import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma'
import { Decimal } from '@prisma/client/runtime/library'

describe('PostgresUpdateTransactionRepository', () => {
    let sut = new PostgresUpdateTransactionRepository()

    // describe('error handling', () => {
    //     it('should throw an error if Prisma throws', async () => {
    //         // arrange
    //         jest.spyOn(prisma.transaction, 'findMany').mockRejectedValueOnce(
    //             new Error('Prisma error'),
    //         )
    //         // act
    //         const promise = sut.execute('any_user_id')
    //         expect(promise).rejects.toThrow(new Error('Prisma error'))
    //     })
    // })

    describe('success', () => {
        it('should update a transaction on database successfully', async () => {
            const user = await createTestUser()
            const transaction = await createTestTransaction({
                user_id: user.id,
                ...params,
                amount: new Decimal(params.amount),
                date: new Date(params.date),
            })

            const response = await sut.execute(transaction.id, params)

            expect(response?.name).toBe(transaction.name)
            expect(response?.type).toBe(transaction.type)
            expect(response?.user_id).toBe(user.id)
            expect(String(response?.amount)).toBe(String(transaction.amount))
            expect(dayjs(response?.date).daysInMonth()).toBe(
                dayjs(transaction.date).daysInMonth(),
            )
            expect(dayjs(response?.date).month()).toBe(
                dayjs(transaction.date).month(),
            )
            expect(dayjs(response?.date).year()).toBe(dayjs(transaction.date).year())
        })
    })
    describe('validations', () => {
        it('should call Prisma with correct params', async () => {
            // arrange
            const user = await createTestUser()
            const transaction = await createTestTransaction({
                user_id: user.id,
            })

            const prismaSpy = jest.spyOn(prisma.transaction, 'update')

            // act
            await sut.execute(transaction.id, params)

            // assert
            expect(prismaSpy).toHaveBeenCalledWith({
                where: {
                    id: transaction.id,
                },
                data: params,
            })
        })
    })
})
