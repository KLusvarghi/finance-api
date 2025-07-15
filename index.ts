import { Request, Response } from 'express'
import express from 'express'
import { PostgresHelper } from './src/db/postgres/helper'

const app = express()

app.get('/', async (req: Request, res: Response) => {
    const results = await PostgresHelper.query('SELECT * FROM users;')
    res.send(JSON.stringify(results))
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
