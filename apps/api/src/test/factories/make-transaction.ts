import { fakerPT_BR as faker } from '@faker-js/faker'
import { Transaction, TransactionType } from '@prisma/client'

import { UserWithTokensResponse } from '@/shared'

import { prisma } from '../../../prisma/prisma'
import { makeUser } from './make-user'

interface MakeTransactionResponse {
    user: UserWithTokensResponse
    transaction: Transaction
}

export const makeTransaction = async (
    transactionData?: Partial<{
        name: string
        amount: number
        date: string
        type: TransactionType
    }>,
    userData?: {
        password?: string
    },
): Promise<MakeTransactionResponse> => {
    // Create user first
    const user = await makeUser(userData?.password)

    // Create transaction associated with the user
    const transaction = await prisma.transaction.create({
        data: {
            id: faker.string.uuid(),
            userId: user.id,
            name: transactionData?.name || faker.lorem.words(3),
            amount:
                transactionData?.amount ||
                faker.number.int({ min: 1, max: 1000 }),
            date: transactionData?.date
                ? new Date(transactionData.date)
                : faker.date.recent(),
            type:
                transactionData?.type ||
                faker.helpers.arrayElement([
                    TransactionType.EARNING,
                    TransactionType.EXPENSE,
                    TransactionType.INVESTMENT,
                ]),
        },
    })

    return {
        user,
        transaction,
    }
}
