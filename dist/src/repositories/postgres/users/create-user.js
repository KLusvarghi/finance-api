import { PostgresHelper } from '@/infra/db/postgres/helper';
export class PostgresCreateUserRepository {
    // como nomenclatura, podemos usar execute, handle ou até create
    async execute(createUserParams) {
        const result = await PostgresHelper.query('INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *', [
            createUserParams.id,
            createUserParams.first_name,
            createUserParams.last_name,
            createUserParams.email,
            createUserParams.password,
        ]);
        // como retorno, ele nos dará uma lista, e o primeiro item será o usuário criado
        return result[0];
    }
}
