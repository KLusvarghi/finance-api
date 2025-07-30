import { PostgresHelper } from '@/infra/db/postgres/helper'

export class PostgresGetUserByEmailRepository {
    async execute(email: string): Promise<any> {
        const user = await PostgresHelper.query(
            `SELECT * FROM users WHERE email = $1`,
            [email],
        )

        return user[0]
    }
}
