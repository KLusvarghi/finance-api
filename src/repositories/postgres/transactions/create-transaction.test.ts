import { PostgresCreateTransactionRepository } from './create-transaction'
import {
    createTestUser,
    createTransactionParams,
    transactionId,
} from '@/test'
import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma'

describe('PostgresCreateTransactionRepository', () => {
    let sut = new PostgresCreateTransactionRepository()

    describe('error handling', () => {
        // it('should throw an error if Prisma throws', async () => {
        //     // arrange
        //     jest.spyOn(prisma.user, 'create').mockRejectedValueOnce(
        //         new Error('Prisma error'),
        //     )
        //     // act
        //     const promise = sut.execute(fakeUser)
        //     expect(promise).rejects.toThrow(new Error('Prisma error'))
        // })
    })

    describe('success', () => {
        it('should create a transaction on database', async () => {
            const user = await createTestUser()

            const response = await sut.execute({
                ...createTransactionParams,
                user_id: user.id,
                id: transactionId,
            })

            expect(response).not.toBeNull()
            expect(response.name).toBe(createTransactionParams.name)
            expect(response.type).toBe(createTransactionParams.type)
            expect(response.user_id).toBe(user.id)
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
                user_id: user.id,
                id: transactionId,
            })
            expect(prismaSpy).toHaveBeenCalledWith({
                data: {
                    ...createTransactionParams,
                    user_id: user.id,
                    id: transactionId,
                },
            })
        })
    })
})
