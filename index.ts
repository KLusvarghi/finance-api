import express from 'express'

import { transactionsRouter, usersRouter } from './src/routes'

export const app = express()
const port = process.env.PORT || 3001

// por padrão, o express não suporta json, então temos que especificar aqui que toda requisição que recebe um req que contem um content-type do tipo JSON, ele adapte para receber
app.use(express.json())

// toda vez que uma requisição for feita para a rota /api/users, o express vai usar o usersRouter para lidar com a requisição
app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
