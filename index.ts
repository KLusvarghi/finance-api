import express, { Request, Response } from 'express'
import { PostgresHelper } from './src/db/postgres/helper'
import 'dotenv/config'

const app = express()
const port = process.env.PORT || 3001

// por padrão, o express não suporta json, então temos que especificar aqui que toda requisição que recebe um req que contem um content-type do tipo JSON, ele adapte para receber
app.use(express.json())

app.get('/', async (req: Request, res: Response) => {
    const results = await PostgresHelper.query('SELECT * FROM users;')
    res.send(JSON.stringify(results))
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
