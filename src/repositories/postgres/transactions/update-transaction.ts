import { PostgresHelper } from '@/infra/db/postgres/helper'

export class PostgresUpdateTransactionByIdRepository {
    async execute(userId: string, upadetParams: any) {
        const updateFields: string[] = []
        const updateValues: any[] = []

        Object.keys(upadetParams).forEach((key, index) => {
            updateFields.push(`${key} = $${updateValues.length + 1}`)
            updateValues.push(upadetParams[key])
        })

        updateValues.push(userId) // adicionando o userID nos valore para em sequencia a gente usar na query

        const updateQuery = `
          UPDATE transactions
          SET ${updateFields.join(', ')}
          WHERE id = $${updateValues.length}
          RETURNING *
        `

        const updateTransaction = await PostgresHelper.query(
            updateQuery,
            updateValues,
        )

        return updateTransaction[0]
    }
}
