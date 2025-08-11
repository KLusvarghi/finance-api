import { UserPublicResponse, UserRepositoryResponse } from '@/shared/types'
import { DeleteUserService } from './delete-user'
import { faker } from '@faker-js/faker'

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

    describe('success', () => {
        it('should successefully delete an user', async () => {
            // act
            const response = await sut.execute(validUserId)

            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual(validUserServiceResponse)
        })
    })
})
