import {
    UpdateUserParams,
    UserPublicResponse,
    UserRepositoryResponse,
} from '@/shared'
import { UpdateUserService } from './update-user'
import { faker } from '@faker-js/faker'

describe('UpdateUserService', () => {
    let sut: UpdateUserService
    let updateUserRepository: UpdateUserRepositoryStub
    let getUserByEmailRepository: GetUserByEmailRepositoryStub
    let getUserByIdRepository: GetUserByIdRepositoryStub
    let passwordHasherAdapter: PasswordHasherAdapterStub
    let updateUserParams: UpdateUserParams
    let validUserRepositoryResponse: UserRepositoryResponse
    let validUpdateUserServiceResponse: UserPublicResponse
    let validUserId: string

    class UpdateUserRepositoryStub {
        async execute(
            userId: string,
            updateUserParams: UpdateUserParams,
        ): Promise<UserRepositoryResponse> {
            return Promise.resolve(validUserRepositoryResponse)
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId: string): Promise<UserRepositoryResponse | null> {
            return Promise.resolve(validUserRepositoryResponse)
        }
    }

    class GetUserByEmailRepositoryStub {
        async execute(_email: string): Promise<UserRepositoryResponse | null> {
            return Promise.resolve(null)
        }
    }

    class PasswordHasherAdapterStub {
        async execute(_password: string): Promise<string> {
            return Promise.resolve(validUserRepositoryResponse.password)
        }
    }

    const makeSut = () => {
        const updateUserRepository = new UpdateUserRepositoryStub()
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()

        const sut = new UpdateUserService(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
            getUserByIdRepository,
        )

        return {
            sut,
            updateUserRepository,
            getUserByEmailRepository,
            getUserByIdRepository,
            passwordHasherAdapter,
        }
    }

    beforeEach(() => {
        const {
            sut: service,
            updateUserRepository: updateUserRepositoryStub,
            getUserByEmailRepository: getUserByEmailRepositoryStub,
            getUserByIdRepository: getUserByIdRepositoryStub,
            passwordHasherAdapter: passwordHasherAdapterStub,
        } = makeSut()

        sut = service
        updateUserRepository = updateUserRepositoryStub
        getUserByEmailRepository = getUserByEmailRepositoryStub
        getUserByIdRepository = getUserByIdRepositoryStub
        passwordHasherAdapter = passwordHasherAdapterStub

        validUserId = faker.string.uuid()

        updateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        }

        validUserRepositoryResponse = {
            id: validUserId,
            first_name: updateUserParams.first_name!,
            last_name: updateUserParams.last_name!,
            email: updateUserParams.email!,
            password: 'valid_hash',
        }

        validUpdateUserServiceResponse = {
            id: validUserId,
            first_name: validUserRepositoryResponse.first_name,
            last_name: validUserRepositoryResponse.last_name,
            email: validUserRepositoryResponse.email,
        }
    })

    describe('success', () => {
        it('should successfully update a user (without password and email)', async () => {
            // act
            const response = await sut.execute(validUserId, updateUserParams)

            // assert
            expect(response).toEqual(validUpdateUserServiceResponse)
        })
    })
})
