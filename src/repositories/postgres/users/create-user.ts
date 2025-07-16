import { PostgresHelper } from '@/db/postgres/helper'

interface CreateUserParams {
    id: string
    first_name: string
    last_name: string
    email: string
    password: string
}

export class PostgresCreateUserRepository {
    // como nomenclatura, podemos usar execute, handle ou até create
    async execute(createUserParams: CreateUserParams) {
        const result = await PostgresHelper.query(
            'INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)',
            [
                createUserParams.id,
                createUserParams.first_name,
                createUserParams.last_name,
                createUserParams.email,
                createUserParams.password,
            ],
        )

        // como retorno, ele nos dará uma lista, e o primeiro item será o usuário criado
        return result[0]
    }
}
