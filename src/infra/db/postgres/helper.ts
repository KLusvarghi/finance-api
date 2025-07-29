import 'dotenv/config'
import { Pool } from 'pg'

// uma pool é uma "piscina" de conexões com o banco de dados
// ela é usada para evitar criar uma nova conexão a cada requisição, então ao invés de criar uma nova conexão a cada requisição, sendo do mesmo client ou de diferentes clients, essa pool nos garante que as conexões serão reutilizadas e é mais eficiente

export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: Number(process.env.POSTGRES_PORT),
    host: process.env.POSTGRES_HOST,

    // podendo adicioanr configs adicionais
    max: 20, // quantidade máxima de conexões
    idleTimeoutMillis: 30000, // tempo máximo de inatividade da conexão
    connectionTimeoutMillis: 2000, // tempo máximo de conexão
    maxLifetimeSeconds: 60, // tempo máximo de vida da conexão
})

// essa constante é apenas um obj que tem um método que recebe a query a ser executada e os parametros
// e utilizaremos ela quando quisermos insrir algo no banco, então, chamaremos ela nos nossos "repositories"
export const PostgresHelper = {
    query: async (query: string, params?: any[]) => {
        const client = await pool.connect() // pegando o client

        // fazendo a query com base nos params
        const results = await client.query(query, params)

        // após executar as ações que queremos com o client, é de boa prática "botar ele de volta na piscina", ou basicamente, devolver ele a onde estava
        await client.release()

        return results.rows
    },
}
