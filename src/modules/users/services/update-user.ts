import { EmailAlreadyExistsError } from "@/errors/user"
import { PostgresGetUserByEmailRepository } from "@/repositories/postgres/users/get-user-by-email"
import { PostgresUpdateUserRepository } from "@/repositories/postgres/users/update-user"
import bcrypt from 'bcrypt'

interface UpdateUserInterface {
  first_name?: string
  last_name?: string
  email?: string
  password?: string
  userId: string
}

export class UpdateUserService{
  async execute(userId: string, updateUserParams: UpdateUserInterface){
    // 1. se o email estiver sendo atualizado, verificar se já está em uso
    if(updateUserParams.email){
      const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()

        const userWithProviderEmail =
            await postgresGetUserByEmailRepository.excute(
              updateUserParams.email,
            )

            // além de validar se o email já está em uso, validamos se o email a ser atualizado é diferente da pessoa que está atualizando, e caso sim, ele entra na condição e invalida a açao
        if (userWithProviderEmail && userWithProviderEmail.id !== userId) {
            throw new EmailAlreadyExistsError(updateUserParams.email)
        }
    }

    const user = {
      ...updateUserParams,
    }

    // 2. se a senha estiver sendo atualizado, criptogra-lá

    if(updateUserParams.password){
      const hashPassword = await bcrypt.hash(updateUserParams.password, 10)
      user.password = hashPassword // assim a gente adiciona ou substitui a props "password" com o valor de hashPassword

      // poderiamos fazer dessa maneira abaixo tbm, mas, para deixar masi claro e separar o que vem e o que retornamos, é melhor criar outra variável
      // updateUserParams.password = hashPassword
    }

    // 3. chamar o repository para atualizar o user no banco de dados
    const updateUserRepository = new PostgresUpdateUserRepository()
    const updateUser = await updateUserRepository.execute(userId, user)

    return updateUser
  }
}
