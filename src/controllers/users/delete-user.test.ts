import { UserRepositoryResponse } from '@/shared'
import { DeleteUserController } from './delete-user'
import { faker } from '@faker-js/faker'

describe('DeleteUserController', () => {
    class DeleteUserServiceStub {
        execute(userId: string): Promise<UserRepositoryResponse | null> {
            return Promise.resolve({
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            })
        }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    const makeSut = () => {
        const deleteUserService = new DeleteUserServiceStub()
        const sut = new DeleteUserController(deleteUserService)

        return { deleteUserService, sut }
    }

    describe('validations', () => {
        describe('userId', () => {
            it('should return 400 if userId is invalid', async () => {
                // arrange
                const { sut } = makeSut()

                // act
                const result = await sut.execute({
                    params: { userId: 'invalid-uuid' },
                })

                // assert
                expect(result.statusCode).toBe(400)
                // Validação do body de erro para UUID inválido
                expect(result.body?.status).toBe('error')
                expect(result.body?.message).toBeTruthy()
                // Poderia ser mais específico: expect(result.body?.message).toContain('invalid')
            })
        })
    })

    describe('success cases', () => {
        it('should return 200 if user is deleted successfully', async () => {
            // arrange
            const { sut } = makeSut()

            // act
            const result = await sut.execute(httpRequest)

            // assert
            expect(result.statusCode).toBe(200)
            // Validação do body de sucesso para deleção
            expect(result.body?.status).toBe('success')
            expect(result.body?.message).toBeTruthy() // Ex: "Success" ou "User deleted successfully"
            expect(result.body?.data).toBeTruthy() // Deve conter os dados do usuário deletado
        })
    })

    describe('error handling', () => {
        it('should return 404 if user is not found', async () => {
            // arrange
            const { sut, deleteUserService } = makeSut()

            // mocando para que ele retrone null
            // jest.spyOn(deleteUserService, 'execute').mockResolvedValue(null)
            jest.spyOn(deleteUserService, 'execute').mockImplementationOnce(
                async () => null,
            )

            // act
            const result = await sut.execute(httpRequest)

            // assert
            expect(result.statusCode).toBe(404)
            // Validação do body de erro para usuário não encontrado
            expect(result.body?.status).toBe('error')
            expect(result.body?.message).toBeTruthy()
            // expect(result.body?.message).toBe("User not found.")
            // Poderia ser mais específico: expect(result.body?.message).toContain('not found')
        })

        it('should return 500 if DeleteUserService throws', async () => {
            // arrange
            const { sut, deleteUserService } = makeSut()

            // mocando para que ele retrone null
            jest.spyOn(deleteUserService, 'execute').mockRejectedValueOnce(
                () => {
                    new Error()
                },
            )

            // act
            const result = await sut.execute(httpRequest)

            // assert
            expect(result.statusCode).toBe(500)
            // Validação do body de erro para erros internos do servidor
            expect(result.body?.status).toBe('error')
            expect(result.body?.message).toBeTruthy()
            // expect(result.body?.message).toBe("User not found.")
            // Mensagem padrão seria: "Internal server error"
        })
    })
})
