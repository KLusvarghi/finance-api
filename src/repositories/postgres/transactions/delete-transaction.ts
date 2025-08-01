import { PostgresHelper } from '@/infra/db/postgres/helper'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId: string) {
        const deletedTransaction = await PostgresHelper.query(
            `DELETE FROM transactions 
       WHERE id = $1 
       RETURNING *`,
            [transactionId],
        )

        return deletedTransaction[0]
    }
}
