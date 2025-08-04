import { prisma } from '../../../../prisma/prisma'

interface CreateUserParams {
    id: string
    first_name: string
    last_name: string
    email: string
    password: string
}

export class PostgresCreateUserRepository {
    // como nomenclatura, podemos usar execute, handle ou até create
    async execute(createUserParams: CreateUserParams) {
        return await prisma.user.create({
            data: {
                id: createUserParams.id,
                first_name: createUserParams.first_name,
                last_name: createUserParams.last_name,
                email: createUserParams.email,
                password: createUserParams.password,
            },
        })
    }
}
