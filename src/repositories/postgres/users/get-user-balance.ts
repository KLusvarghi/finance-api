import { PostgresHelper } from "@/infra/db/postgres/helper";

export class PostgresGetUserBalanceRepository{
  async execute(userId: string){
    const result = await PostgresHelper.query(
      `
        SELECT * from get_user_balance($1);
      `, 
      [userId]
    )

    return {
      userId,
      ...result[0]
    }
  }
}
