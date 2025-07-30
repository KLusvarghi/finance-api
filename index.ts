import express from 'express'
import 'dotenv/config'
import {
    DeleteUserController,
    UpdateUserController,
    CreateUserController,
    GetUserByIdController,
} from '@/controllers/users'
import { PostgresGetUserByIdRepository } from '@/repositories/postgres/users/get-user-by-id'
import { GetUserByIdService } from '@/services/users/get-user-by-id'
import { PostgresCreateUserRepository } from '@/repositories/postgres/users/create-user'
import { CreateUserService } from '@/services/users/create-user'
import { PostgresUpdateUserRepository } from '@/repositories/postgres/users/update-user'
import { UpdateUserService } from '@/services/users/update-user'
import { DeleteUserService } from '@/services/users/delete-user'
import { PostgresGetUserByEmailRepository } from '@/repositories/postgres/users/get-user-by-email'
import { PostgresDeleteUserRepository } from '@/repositories/postgres/users/delete-user'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserByIdController,
    makeUpdateUserController,
} from '@/factories/controllers/user'

const app = express()
const port = process.env.PORT || 3001

// por padrão, o express não suporta json, então temos que especificar aqui que toda requisição que recebe um req que contem um content-type do tipo JSON, ele adapte para receber
app.use(express.json())

// cria user
app.post('/api/users', async (request, response) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).send(body)
})

// consulta user
app.get('/api/users/:userId', async (request, response) => {
    const getUserByIdController = makeGetUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute(request)

    response.status(statusCode).send(body)
})

// udpate user
app.patch('/api/users/:userId', async (request, response) => {
    const updateUserController = makeUpdateUserController()

    const { statusCode, body } = await updateUserController.execute(request)

    response.status(statusCode).send(body)
})

// deletar user
app.delete('/api/users/:userId', async (request, response) => {
    const deleteUserController = makeDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute(request)

    response.status(statusCode).send(body)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
