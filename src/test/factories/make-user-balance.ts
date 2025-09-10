import jwt from 'jsonwebtoken'

import { prisma } from '../../../prisma/prisma'

import { TransactionPublicResponse } from '@/shared'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

export const makeUserBalance = async (
    userId: string,
    accessToken: string,
    date: string,
    amount: number,
    type: TransactionType,
): Promise<TransactionPublicResponse> => {
    const transaction = await prisma.transaction.create({
        data: {
            userId: userId,
            id: faker.string.uuid(),
            name: faker.string.sample(),
            date: new Date(date),
            amount: amount,
            type: type,
        },
    })

    const verifiedToken = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
    ) as { userId: string }

    if (!verifiedToken) {
        throw new Error('Invalid token')
    }

    return {
        id: transaction.id,
        userId: transaction.userId,
        name: transaction.name,
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type,
        updatedAt: transaction.updatedAt,
    }
}
