import { PostgresHelper } from '@/db/postgres/helper'

export class PostgresGetUserByEmailRepository {
    async excute(email: string): Promise<any> {
        const user = await PostgresHelper.query(
            `SELECT * FROM users WHERE email = $1`,
            [email],
        )

        return user[0]
    }
}
