import { prisma } from '../../../../prisma/prisma'
import { PostgresCreateTransactionRepository } from './create-transaction'
import { createTestTransaction, createTestUser, createTransactionParams, createTransactionServiceResponse } from '@/test'

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
                id: user.id,
            })

            expect(response).not.toBeNull()
            // expect(response).toStrictEqual(createTransactionServiceResponse)
        })
    })

    describe('validations', () => {
        // it('should call Prisma with correct params', async () => {
        //     const prismaSpy = jest.spyOn(prisma.user, 'create')

        //     await sut.execute(fakeUser)

        //     expect(prismaSpy).toHaveBeenCalledWith({
        //         data: fakeUser,
        //     })
        // })
    })
})
