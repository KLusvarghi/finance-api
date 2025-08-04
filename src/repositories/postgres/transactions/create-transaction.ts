import { EnumLike } from 'zod/v4/core/util.cjs'
import { prisma } from '../../../../prisma/prisma'
import { TransctionType } from '@prisma/client'

interface CreateTransactionParamsProps {
    id: string
    user_id: string
    name: string
    amount: number
    date: Date
    type: TransctionType
}

export class PostgresCreateTransactionRepository {
    async execute(createTransactionParams: CreateTransactionParamsProps) {
        return await prisma.transaction.create({
            data: createTransactionParams
        })
    }
}
