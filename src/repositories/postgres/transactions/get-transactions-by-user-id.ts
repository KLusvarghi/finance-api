import { PostgresHelper } from '@/infra/db/postgres/helper'

export class PostgresGetTransactionsByUserIdRepository {
    async execute(userId: string) {
        const transactions = await PostgresHelper.query(
            `SELECT * FROM transactions WHERE user_id = $1`,
            [userId],
        )

        console.log(transactions)
        return transactions
    }
}
