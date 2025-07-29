import express from 'express'
import 'dotenv/config'
import { CreateUserController } from '@/modules/users/controllers/create-user'
import { GetUserByIdController } from '@/modules/users/controllers/get-user-by-id'
import { UpdateUserController } from '@/modules/users/controllers/update-user'

const app = express()
const port = process.env.PORT || 3001

// por padrão, o express não suporta json, então temos que especificar aqui que toda requisição que recebe um req que contem um content-type do tipo JSON, ele adapte para receber
app.use(express.json())

// cria user
app.post('/api/users', async (request, response) => {
  const createUserController = new CreateUserController()

  const { statusCode, body } = await createUserController.execute(request)

  response.status(statusCode).send(body)
})

// consulta user
app.get('/api/users/:userId', async (request, response) => {
  const getUserByIdController = new GetUserByIdController()

  const { statusCode, body } = await getUserByIdController.execute(request)

  response.status(statusCode).send(body)
})

// udpate user
// consulta user
app.patch('/api/users/:userId', async (request, response) => {
  const updateUserController = new UpdateUserController()

  const { statusCode, body } = await updateUserController.execute(request)

  response.status(statusCode).send(body)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
