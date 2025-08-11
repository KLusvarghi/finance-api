import { EmailAlreadyExistsError } from '@/errors/user'
import { CreateUserService } from './create-user'
import {
    CreateUserParams,
    UserPublicResponse,
    UserRepositoryResponse,
} from '@/shared'
import { faker } from '@faker-js/faker'

describe('CreateUserService', () => {
    let sut: CreateUserService
    let createUserRepository: CreateUserRepositoryStub
    let getUserByEmailRepository: GetUserByEmailRepositoryStub
    let passwordHasherAdapter: PasswordHasherAdapterStub
    let idGeneratorAdapter: IdGeneratorAdapterStub
    let createUserParams: CreateUserParams
    let validUserRepositoryResponse: UserRepositoryResponse
    let validCreateUserServiceResponse: UserPublicResponse

    class CreateUserRepositoryStub {
        async execute(
            _params: CreateUserParams,
        ): Promise<UserRepositoryResponse> {
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
    class IdGeneratorAdapterStub {
        execute(): string {
            return validUserRepositoryResponse.id
        }
    }

    const makeSut = () => {
        const createUserRepository = new CreateUserRepositoryStub()
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()
        const sut = new CreateUserService(
            createUserRepository,
            getUserByEmailRepository,
            idGeneratorAdapter,
            passwordHasherAdapter,
        )
        return {
            sut,
            createUserRepository,
            getUserByEmailRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        }
    }

    beforeEach(() => {
        const {
            sut: service,
            createUserRepository: createUserRepositoryStub,
            getUserByEmailRepository: getUserByEmailRepositoryStub,
            passwordHasherAdapter: passwordHasherAdapterStub,
            idGeneratorAdapter: idGeneratorAdapterStub,
        } = makeSut()
        sut = service
        createUserRepository = createUserRepositoryStub
        getUserByEmailRepository = getUserByEmailRepositoryStub
        passwordHasherAdapter = passwordHasherAdapterStub
        idGeneratorAdapter = idGeneratorAdapterStub

        createUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 7 }),
        }

        
        validUserRepositoryResponse = {
          id: faker.string.uuid(),
          ...createUserParams,
          password: 'valid_hash',
        }

        validCreateUserServiceResponse = {
            id: validUserRepositoryResponse.id,
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
        it('should throw an EmailAlreadyExistsError if getUserByEmailRepository returns a user', () => {
            // arrange
            // mockando o retorno do getUserByEmailRepository, mas dessa vez, retornando um usuário válido
            jest.spyOn(
                getUserByEmailRepository,
                'execute',
            ).mockResolvedValueOnce(validUserRepositoryResponse)

            // act
            // nestes casos, o teste deve falhar, pois o usuário já existe
            // então, não queremos que nossa promise seja resolvida
            // então, não vamos usar o await (assim a promisse não é resolvida)

            const response = sut.execute(createUserParams)

            // assert
            // e aqui, esperamos que nossa promisse seja rejeitada, lançando o erro "EmailAlreadyExistsError" para cima (para o nosso controller)
            expect(response).rejects.toThrow(
                new EmailAlreadyExistsError(createUserParams.email),
            )
        })
    })

    describe('validations', () => {
      it('should call idGeneratorAdapter to generate a random uuid', async () => {
        // arrange
        // neste caso, não precisamos mocar nada, apenas falar para ele espiar o idGeneratorAdapter
        const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, 'execute')

        // para que a gente verifique se esse "id" foi retornado passado para o repository, temos que espiar a classe "CreateUserRepository"
        const createUserRepositorySpy = jest.spyOn(createUserRepository, 'execute')

        // act
        await sut.execute(createUserParams)

        // assert
        // validando se o idGeneratorAdapter foi chamado
        expect(idGeneratorAdapterSpy).toHaveBeenCalled()
        expect(idGeneratorAdapterSpy).toHaveBeenCalledTimes(1)

        // validando se o createUserRepository foi chamado contendo o Id gerado pelo idGeneratorAdapter
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...createUserParams,
            id: validUserRepositoryResponse.id,
            password: validUserRepositoryResponse.password,
        })
        expect(createUserRepositorySpy).toHaveBeenCalledTimes(1)
      })

      it('should call passwordHasherAdapter to hash the password', async () => {
        // arrange
        const passwordHasherAdapterSpy = jest.spyOn(passwordHasherAdapter, 'execute')

        const createUserRepositorySpy = jest.spyOn(createUserRepository, 'execute')

        // act
        await sut.execute(createUserParams)

        // assert
        // validando se o passwordHasherAdapter foi chamado
        expect(passwordHasherAdapterSpy).toHaveBeenCalled()
        expect(passwordHasherAdapterSpy).toHaveBeenCalledTimes(1)

        // validando se o createUserRepository foi chamado contendo o Id gerado pelo passwordHasherAdapter
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...createUserParams,
            id: validUserRepositoryResponse.id,
            password: validUserRepositoryResponse.password,
        })
        expect(createUserRepositorySpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('success', () => {
        it('should successefully create a user', async () => {
            // act
            const response = await sut.execute(createUserParams)

            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual(validCreateUserServiceResponse)
        })
    })
})
