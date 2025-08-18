import { prisma } from '../../../../prisma/prisma'

import { UserBalanceRepositoryResponse } from '@/shared'
import { Prisma, TransactionType } from '@prisma/client'

export class PostgresGetUserBalanceRepository {
    async execute(userId: string): Promise<UserBalanceRepositoryResponse> {
        // para que a gente consiga fazer essa query, ao invés de usar uma function que abstraia a query, vamos usar aggragation: https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing

        // sem fazer o destructuring
        // const totalExpense = await prisma.transaction.aggregate({
        // fazendo o distructuring para que eu não precise acessar a variavel assim: _sum.amount; e sim:

        // Executar todas as agregações em paralelo para melhor performance
        const [expensesResult, earningsResult, investmentsResult] =
            await Promise.all([
                prisma.transaction.aggregate({
                    // dizemso primeiro onde / o que queremos agragar

                    where: {
                        user_id: userId,
                        type: TransactionType.EXPENSE,
                    },
                    // o que voltar do where eu irei somar

                    _sum: {
                        // somando o campo amount de tudo que voltar do where
                        amount: true,
                    },
                }),
                prisma.transaction.aggregate({
                    where: {
                        user_id: userId,
                        type: TransactionType.EARNING,
                    },
                    _sum: {
                        amount: true,
                    },
                }),
                prisma.transaction.aggregate({
                    where: {
                        user_id: userId,
                        type: TransactionType.INVESTMENT,
                    },
                    _sum: {
                        amount: true,
                    },
                }),
            ])

        // Converter Decimal para number e tratar valores nulos
        const totalExpenses =
            Number(expensesResult._sum.amount) || new Prisma.Decimal(0)
        const totalEarnings =
            Number(earningsResult._sum.amount) || new Prisma.Decimal(0)
        const totalInvestments =
            Number(investmentsResult._sum.amount) || new Prisma.Decimal(0)

        // Calcular o balance: ganhos - despesas - investimentos
        const balance = new Prisma.Decimal(totalEarnings)
            .sub(totalExpenses)
            .sub(totalInvestments)
        // const balance2 = new Prisma.Decimal(
        //     totalEarnings - totalExpenses + totalInvestments,
        // )

        return {
            earnings: totalEarnings,
            expenses: totalExpenses,
            investments: totalInvestments,
            balance,
        }
    }
}
