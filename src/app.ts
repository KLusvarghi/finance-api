import express from 'express'
import fs from 'fs'
import path from 'path'
import swaggerUi from 'swagger-ui-express'

import { errorHandler } from './middlewares/error-handler'
import { routeNotFound } from './middlewares/route-not-found'
import { authRouter, transactionsRouter, usersRouter } from './routes'

// no teste e2e, acontece que se a gente deixa a instancia do app junto com a instancia do server,
// o jest não consegue fechar as conexões abertas, então temos que criar uma função para criar a instancia do app
// e depois exportar ela:

export const app = express()

// por padrão, o express não suporta json, então temos que especificar aqui que toda requisição
// que recebe um req que contem um content-type do tipo JSON, ele adapte para receber
app.use(express.json())

// toda vez que uma requisição for feita para a rota /api/users, o express vai usar o usersRouter para lidar com a requisição
app.use('/api/auth', authRouter)
app.use('/api/transactions', transactionsRouter)
app.use('/api/users', usersRouter)

// ao ler o arquivo ele trará como string, então temos que converter para JSON
// Usa process.cwd() que funciona tanto no Jest quanto em produção
const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'docs/swagger.json'), 'utf8'),
)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(routeNotFound)

// Error handling middleware must be registered LAST
app.use(errorHandler)
