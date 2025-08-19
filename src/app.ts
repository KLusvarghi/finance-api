import express from 'express'

import { transactionsRouter, usersRouter } from './routes'

// no teste e2e, acoontece que se a gente deixa a instancia do app junto com a instancia do server, o jest não consegue fechar as conexões abertas, então temos que criar uma função para criar a instancia do app
// e depois exportar ela:

export const app = express()
// por padrão, o express não suporta json, então temos que especificar aqui que toda requisição que recebe um req que contem um content-type do tipo JSON, ele adapte para receber
app.use(express.json())

// toda vez que uma requisição for feita para a rota /api/users, o express vai usar o usersRouter para lidar com a requisição
app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)
