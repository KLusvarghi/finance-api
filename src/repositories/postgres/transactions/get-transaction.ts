import { PostgresHelper } from '@/infra/db/postgres/helper'

export class PostgresGetTransactionRepository {
    async execute(userId: string) {
        const transaction = await PostgresHelper.query(
            `SELECT * FROM transactions WHERE user_id = $1`,
            [userId],
        )
        return transaction[0]
    }
}
