import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { CreateUserParams } from '../types'
import { EmailAlreadyExistsError } from '@/errors/user'

export class CreateUserService {
    constructor(createUserRepository, getUserByEmailRepository) {
        this.createUserRepository = createUserRepository
        this.getUserByEmailRepository = getUserByEmailRepository
    }
    async execute(createUserParams: CreateUserParams) {
        // verificar se o e-mail já está cadastrado no banco

        const userWithProviderEmail =
            await this.getUserByEmailRepository.excute(createUserParams.email)

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
        return await this.createUserRepository.execute(user)

        // 2º maneira de fazer isso é injetar como dependencia no constructor
    }
}
