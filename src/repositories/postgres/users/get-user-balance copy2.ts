import { prisma } from '../../../../prisma/prisma'

export class PostgresGetUserBalanceRepositorySemPromisseALl {
    async execute(userId: string) {
        // para que a gente consiga fazer essa query, ao invés de usar uma function que abstraia a query, vamos usar aggragation: https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing

        // sem fazer o destructuring
        // const totalExpense = await prisma.transaction.aggregate({
        // fazendo o distructuring para que eu não precise acessar a variavel assim: _sum.amount; e sim:
        const {
            _sum: { amount: totalExpenses },
        } = await prisma.transaction.aggregate({
            // dizemso primeiro onde / o que queremos agragar
            where: {
                user_id: userId,
                type: 'EXPENSE',
            },
            // o que voltar do where eu irei somar
            _sum: {
                // soamndo o campo amount de tudo que voltar do where
                amount: true,
            },
        })
        const {
            _sum: { amount: totalEarnings },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'EARNING',
            },
            _sum: {
                amount: true,
            },
        })
        const {
            _sum: { amount: totalInvestments },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: 'INVESTMENT',
            },
            _sum: {
                amount: true,
            },
        })

        const _totalEarnings = totalEarnings || 0
        const _totalExpenses = totalExpenses || 0
        const _totalInvestments = totalInvestments || 0

        const balance = _totalEarnings - _totalExpenses + _totalInvestments

        return {
            earning: _totalEarnings,
            expenses: _totalExpenses,
            investments: _totalInvestments,
            balance,
        }
    }
}
