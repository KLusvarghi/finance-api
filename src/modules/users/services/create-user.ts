import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { PostgresCreateUserRepository } from '@/repositories/postgres/users/create-user'
import { CreateUserParams } from '../types'
import { PostgresGetUserByEmailRepository } from '@/repositories/postgres/users/get-user-by-email'
import { EmailAlreadyExistsError } from '@/errors/user'

export class CreateUserService {
    async execute(createUserParams: CreateUserParams) {
        // verificar se o e-mail já está cadastrado no banco
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()

        const userWithProviderEmail =
            await postgresGetUserByEmailRepository.excute(
                createUserParams.email,
            )

        if (userWithProviderEmail) {
            throw new EmailAlreadyExistsError(createUserParams.email)
        }

        // gerar o UUID
        const userId = uuidv4()

        // criptografdar a senha
        // sendo o "10" o "Salt", que é o nível de criptografia
        const hashPassword = await bcrypt.hash(createUserParams.password, 10)

        const user = {
            // dessestruturando o que a gente recebe como parametrp
            ...createUserParams,
            id: userId,
            // e colocando o password no final para ele sobrescrever o que está sendo desestruturado acima
            password: hashPassword,
        }

        // inserir o user no db
        // chamar o repository
        // 1º maneira de fazer isso
        const postgresCreateUserRepository = new PostgresCreateUserRepository()
        return await postgresCreateUserRepository.execute(user)

        // 2º maneira de fazer isso é injetar como dependencia no constructor
    }
}
