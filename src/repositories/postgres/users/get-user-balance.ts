import { PostgresHelper } from "@/infra/db/postgres/helper";

export class PostgresGetUserBalanceRepository{
  async execute(userId: string){
    const result = await PostgresHelper.query(
      `
        SELECT
          COALESCE( SUM(amount)   FILTER (WHERE type = 'EARNING')   , 0) AS earnings,
          COALESCE( SUM(amount)   FILTER (WHERE type = 'EXPENSE')   , 0) AS expenses,
          COALESCE( SUM(amount)   FILTER (WHERE type = 'INVESTMENT'), 0) AS investments,
          -- saldo = ganhos – gastos – investimentos
          COALESCE( SUM(amount)   FILTER (WHERE type = 'EARNING')   , 0)
          - COALESCE( SUM(amount) FILTER (WHERE type = 'EXPENSE')   , 0)
          - COALESCE( SUM(amount) FILTER (WHERE type = 'INVESTMENT'), 0)
            AS balance
        FROM transactions
        WHERE user_id = $1;
      `, 
      [userId]
    )

    return {
      userId,
      ...result[0]
    }
  }
}
