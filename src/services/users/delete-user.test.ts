import { UserPublicResponse, UserRepositoryResponse } from '@/shared/types'
import { DeleteUserService } from './delete-user'
import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '@/errors/user'

describe('DeleteUserService', () => {
    let sut: DeleteUserService
    let deleteUserRepository: DeleteUserRepositoryStub
    let validUserRepositoryResponse: UserRepositoryResponse
    let validUserServiceResponse: UserPublicResponse
    let validUserId: string

    class DeleteUserRepositoryStub {
        async execute(_id: string): Promise<UserRepositoryResponse | null> {
            return Promise.resolve(validUserRepositoryResponse)
        }
    }

    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()
        const sut = new DeleteUserService(deleteUserRepository)

        return {
            sut,
            deleteUserRepository,
        }
    }

    beforeEach(() => {
        const { sut: service, deleteUserRepository: deleteUserRepositoryStub } =
            makeSut()

        sut = service
        deleteUserRepository = deleteUserRepositoryStub

        validUserId = faker.string.uuid()

        validUserRepositoryResponse = {
            id: validUserId,
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        }
        validUserServiceResponse = {
            id: validUserId,
            first_name: validUserRepositoryResponse.first_name,
            last_name: validUserRepositoryResponse.last_name,
            email: validUserRepositoryResponse.email,
        }
    })

    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
        jest.resetAllMocks()
    })

    describe('error handling', () => {
        it('should return UserNotFoundError if user is not found', async () => {
            // arrange
            jest.spyOn(deleteUserRepository, 'execute').mockResolvedValueOnce(
                null,
            )

            // act
            const response = sut.execute(validUserId)

            // assert
            expect(response).rejects.toThrow(UserNotFoundError)
        })

        // esse tipo de teste é importnate para garantir que o nosso service não está tratando a excessão do nosso repository e passando para cima para o nosso controller
        it('should throw if DeleteUserRepository throws', async () => {
            // arrange
            jest.spyOn(deleteUserRepository, 'execute').mockRejectedValueOnce(
                new UserNotFoundError(validUserId),
            )

            // act
            const response = sut.execute(validUserId)

            // assert
            expect(response).rejects.toThrow()
        })
    })

    describe('success', () => {
        it('should successefully delete an user', async () => {
            // act
            const response = await sut.execute(validUserId)

            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual(validUserServiceResponse)
        })
    })

    describe('validations', () => {
        //  validando se o deleteUserRepository foi chamado com o id correto
        it('should call deleteUserRepository with correct params', async () => {
            // arrange
            const executeSpy = jest.spyOn(deleteUserRepository, 'execute')

            // act
            await sut.execute(validUserId)

            // assert
            expect(executeSpy).toHaveBeenCalledWith(validUserId)
            expect(executeSpy).toHaveBeenCalledTimes(1)
        })
    })
})
