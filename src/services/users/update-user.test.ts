import {
    UpdateUserParams,
    UserPublicResponse,
    UserRepositoryResponse,
} from '@/shared'
import { UpdateUserService } from './update-user'
import { faker } from '@faker-js/faker'
import { EmailAlreadyExistsError, UserNotFoundError } from '@/errors/user'

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

    describe('error handling', () => {
        it('should throw EmailAlreadyExistsError if email already exists', () => {
            // arrange
            // mockamos o retorno para que o email já exista e ele entre no if do service
            jest.spyOn(
                getUserByEmailRepository,
                'execute',
            ).mockResolvedValueOnce(validUserRepositoryResponse)

            // act
            // não passamos o await para que ele retorne uma promise e não um valor
            // passando um id diferente do que é passado no "validUserRepositoryResponse" para que ele entre no outro if do service e retorne o erro
            const promise = sut.execute(faker.string.uuid(), {
                email: validUpdateUserServiceResponse.email,
            })

            // assert
            expect(promise).rejects.toThrow(
                new EmailAlreadyExistsError(
                    validUpdateUserServiceResponse.email,
                ),
            )
        })

        it('should throw UserNotFoundError if GetUserByIdRepository throws', async () => {
          // arrange
          jest.spyOn(
              getUserByIdRepository,
              'execute',
          ).mockRejectedValueOnce(new Error())

          // act
          const promise = sut.execute(validUserId, updateUserParams)

          // assert
          expect(promise).rejects.toThrow()
      })
    })

    describe('success', () => {
        it('should successfully update a user (without password and email)', async () => {
            // act
            const response = await sut.execute(validUserId, updateUserParams)

            // assert
            expect(response).toEqual(validUpdateUserServiceResponse)
        })

        it('should successfully update a user (with email)', async () => {
            // arrange
            const getUserByEmailRepositorySpy = jest.spyOn(
                getUserByEmailRepository,
                'execute',
            )

            // act
            const response = await sut.execute(validUserId, {
                email: validUpdateUserServiceResponse.email,
            })

            // assert
            expect(response).toEqual(validUpdateUserServiceResponse)

            // para garantir que o repository seja chamado com o email que estamos passando no service:
            expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(
                validUpdateUserServiceResponse.email,
            )
        })

        it('should successfully update a user (with password)', async () => {
            // arrange
            const passwordHasherAdapterSpy = jest.spyOn(
                passwordHasherAdapter,
                'execute',
            )

            // act
            const response = await sut.execute(validUserId, {
                password: updateUserParams.password,
            })

            // assert
            expect(response).toEqual(validUpdateUserServiceResponse)

            // para garantir que o repository seja chamado com o email que estamos passando no service:
            expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(
                updateUserParams.password,
            )
        })

        describe('validations', () => {
            it('should call UpdateUserRepository with correct params', async () => {
                // arrange
                const executeSpy = jest.spyOn(updateUserRepository, 'execute')

                // act
                await sut.execute(validUserId, updateUserParams)

                // assert
                // O serviço deve fazer hash da senha antes de chamar o repository
                const expectedParams = {
                    ...updateUserParams,
                    password: 'valid_hash', // Senha já com hash
                }

                expect(executeSpy).toHaveBeenCalledWith(
                    validUserId,
                    expectedParams,
                )
                expect(executeSpy).toHaveBeenCalledTimes(1)
            })
        })
    })
})
