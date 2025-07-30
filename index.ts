import express from 'express'
import 'dotenv/config'
import {
    DeleteUserController,
    UpdateUserController,
    CreateUserController,
    GetUserByIdController,
} from '@/modules/users/controllers'
import { PostgresGetUserByIdRepository } from '@/repositories/postgres/users/get-user-by-id'
import { GetUserByIdService } from '@/modules/users/services/get-user-by-id'
import { PostgresCreateUserRepository } from '@/repositories/postgres/users/create-user'
import { CreateUserService } from '@/modules/users/services/create-user'
import { PostgresUpdateUserRepository } from '@/repositories/postgres/users/update-user'
import { UpdateUserService } from '@/modules/users/services/update-user'
import { DeleteUserService } from '@/modules/users/services/delete-user'
import { PostgresGetUserByEmailRepository } from '@/repositories/postgres/users/get-user-by-email'
import { PostgresDeleteUserRepository } from '@/repositories/postgres/users/delete-user'

const app = express()
const port = process.env.PORT || 3001

// por padrão, o express não suporta json, então temos que especificar aqui que toda requisição que recebe um req que contem um content-type do tipo JSON, ele adapte para receber
app.use(express.json())

// cria user
app.post('/api/users', async (request, response) => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const createUserRepository = new PostgresCreateUserRepository()

    const createUserService = new CreateUserService(
        createUserRepository,
        getUserByEmailRepository,
    )

    const createUserController = new CreateUserController(createUserService)

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).send(body)
})

// consulta user
app.get('/api/users/:userId', async (request, response) => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserByIdService = new GetUserByIdService(getUserByIdRepository)

    const getUserByIdController = new GetUserByIdController(getUserByIdService)

    const { statusCode, body } = await getUserByIdController.execute(request)

    response.status(statusCode).send(body)
})

// udpate user
app.patch('/api/users/:userId', async (request, response) => {
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
    const updateUserRepository = new PostgresUpdateUserRepository()

    const updateUserService = new UpdateUserService(
      getUserByEmailRepository,
      updateUserRepository,
    )

    const updateUserController = new UpdateUserController(updateUserService)

    const { statusCode, body } = await updateUserController.execute(request)

    response.status(statusCode).send(body)
})

// deletar user
app.delete('/api/users/:userId', async (request, response) => {
    const deletedUserRepository = new PostgresDeleteUserRepository()

    const deleteUserService = new DeleteUserService(deletedUserRepository)

    const deleteUserController = new DeleteUserController(deleteUserService)

    const { statusCode, body } = await deleteUserController.execute(request)

    response.status(statusCode).send(body)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
