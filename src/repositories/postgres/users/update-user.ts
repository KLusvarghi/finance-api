import { PostgresHelper } from '@/infra/db/postgres/helper'

export class PostgresUpdateUserRepository {
    async execute(userId: string, upadetParams: any) {
        const updateFields = []
        const updateValues = []

        // percorrendo o objeto
        Object.keys(upadetParams).forEach((key, index) => {
            updateFields.push(`${key} = $${updateValues.length + 1}`)
            updateValues.push(upadetParams[key])
        })

        updateValues.push(userId) // adicionando o userID nos valore para em sequencia a gente usar na query

        const updateQuery = `
          UPDATE users
          SET ${updateFields.join(', ')}
          WHERE id = $${updateValues.length}
          RETURNING *
        `
        // updateFields.join(', ') fará com que transforme o array em um string unica
        // o RETURNING retorna o usuário após o update

        const updateUser = await PostgresHelper.query(updateQuery, updateValues)

        return updateUser[0]
    }
}
