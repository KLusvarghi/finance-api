import { prisma } from '../../../../prisma/prisma'

import {
    GetUserBalanceRepository,
    UserBalanceRepositoryResponse,
} from '@/shared'
import { Prisma, TransactionType } from '@prisma/client'

export class PostgresGetUserBalanceRepository
    implements GetUserBalanceRepository
{
    async execute(
        userId: string,
        from: string,
        to: string,
    ): Promise<UserBalanceRepositoryResponse> {
        // para que a gente consiga fazer essa query, ao invés de usar uma function que abstraia a query, vamos usar aggragation: https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing

        // sem fazer o destructuring
        // const totalExpense = await prisma.transaction.aggregate({
        // fazendo o distructuring para que eu não precise acessar a variavel assim: _sum.amount; e sim:

        const dataFilter = {
            date: {
                gte: new Date(from),
                lte: new Date(to),
            },
        }

        // Executar todas as agregações em paralelo para melhor performance
        const [expensesResult, earningsResult, investmentsResult] =
            await Promise.all([
                prisma.transaction.aggregate({
                    // dizemso primeiro onde / o que queremos agragar

                    where: {
                        userId: userId,
                        type: TransactionType.EXPENSE,
                        ...dataFilter,
                    },
                    // o que voltar do where eu irei somar

                    _sum: {
                        // somando o campo amount de tudo que voltar do where
                        amount: true,
                    },
                }),
                prisma.transaction.aggregate({
                    where: {
                        userId: userId,
                        type: TransactionType.EARNING,
                        ...dataFilter,
                    },
                    _sum: {
                        amount: true,
                    },
                }),
                prisma.transaction.aggregate({
                    where: {
                        userId: userId,
                        type: TransactionType.INVESTMENT,
                        ...dataFilter,
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

        const total = new Prisma.Decimal(totalEarnings)
            .plus(totalExpenses)
            .plus(totalInvestments)

        // Calcular o balance: ganhos - despesas - investimentos
        const balance = new Prisma.Decimal(totalEarnings)
            .sub(totalExpenses)
            .sub(totalInvestments)

        const earningsPercentage = total.isZero()
            ? 0
            : new Prisma.Decimal(totalEarnings)
                  .div(total)
                  .mul(100)
                  .floor()
                  .toNumber()

        const expensesPercentage = total.isZero()
            ? 0
            : new Prisma.Decimal(totalExpenses)
                  .div(total)
                  .mul(100)
                  .floor()
                  .toNumber()

        const investmentsPercentage = total.isZero()
            ? 0
            : new Prisma.Decimal(totalInvestments)
                  .div(total)
                  .mul(100)
                  .floor()
                  .toNumber()

        return {
            earnings: totalEarnings.toString(),
            expenses: totalExpenses.toString(),
            investments: totalInvestments.toString(),
            balance: balance.toString(),
            earningsPercentage: earningsPercentage,
            expensesPercentage: expensesPercentage,
            investmentsPercentage: investmentsPercentage,
        }
    }
}

// Alias para manter compatibilidade com as importações
export { PostgresGetUserBalanceRepository as GetUserBalanceRepository }
