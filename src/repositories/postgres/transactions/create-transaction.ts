import { PostgresHelper } from "@/infra/db/postgres/helper"

export class PostgresCreateTransaction {
    async execute(createTransactionParams: any) {
        const result = await PostgresHelper.query(
            `INSERT INTO users (id, user_id, name, amount, date, type)
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [
                createTransactionParams.id,
                createTransactionParams.user_id,
                createTransactionParams.name,
                createTransactionParams.amount,
                createTransactionParams.date,
                createTransactionParams.type,
            ],
        )

        // como retorno, ele nos dará uma lista, e o primeiro item será o usuário criado
        return result[0]
    }
}
