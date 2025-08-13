import { createUserRepositoryResponse } from "@/test"
import { PostgresCreateUserRepository } from "./create-user"

describe('CreateUserRepository', () => {
    it('should create a user on database', async () => {
        const sut = new PostgresCreateUserRepository()

        const response = await sut.execute(createUserRepositoryResponse)

        expect(response).not.toBeNull()
        expect(response).toEqual(createUserRepositoryResponse)
    })
})
