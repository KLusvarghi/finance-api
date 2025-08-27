import { EmailAlreadyExistsError } from '@/errors'
import { CreateUserService } from '@/services'
import {
    createUserParams,
    createUserRepositoryResponse,
    createUserServiceResponse,
} from '@/test'
describe('CreateUserService', () => {
    let sut
    let createUserRepository
    let getUserByEmailRepository
    let passwordHasherAdapter
    let idGeneratorAdapter
    class CreateUserRepositoryStub {
        async execute(_params) {
            return Promise.resolve(createUserRepositoryResponse)
        }
    }
    class GetUserByEmailRepositoryStub {
        async execute(_email) {
            return Promise.resolve(null)
        }
    }
    class PasswordHasherAdapterStub {
        async execute(_password) {
            return Promise.resolve(createUserRepositoryResponse.password)
        }
    }
    class IdGeneratorAdapterStub {
        execute() {
            return createUserServiceResponse.id
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
            ).mockResolvedValueOnce(createUserRepositoryResponse)
            // act
            // nestes casos, o teste deve falhar, pois o usuário já existe
            // então, não queremos que nossa promise seja resolvida
            // então, não vamos usar o await (assim a promisse não é resolvida)
            const promise = sut.execute(createUserParams)
            // assert
            // e aqui, esperamos que nossa promisse seja rejeitada, lançando o erro "EmailAlreadyExistsError" para cima (para o nosso controller)
            expect(promise).rejects.toThrow(
                new EmailAlreadyExistsError(createUserParams.email),
            )
        })
        // se houver uma excessão de qualquer tipo, eu não quero que ela seja tratada dentro do meu service, mas sim, lançada para cima (para o nosso controller)
        it('should throw if GetUserByEmailRepository throws', () => {
            // arrange
            jest.spyOn(
                getUserByEmailRepository,
                'execute',
            ).mockRejectedValueOnce(new Error())
            // act
            // não vamos usar o await, pois queremos que a promisse seja rejeitada
            const promise = sut.execute(createUserParams)
            // assert
            // e aqui, esperamos que nossa promisse seja rejeitada, lançando o erro "Error" para cima (para o nosso controller)
            expect(promise).rejects.toThrow()
        })
        // fazendo o mesmo para idGeneratorAdapter
        it('should throw if IdGeneratorAdapter throws', () => {
            // arrange
            // como o "execute" do idGeneratorAdapter é não é uma promisse e sim uma função normal, não podemos usar o "mockRejectedValueOnce"
            // então, vamos usar o "mockImplementationOnce"
            jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(
                () => {
                    throw new Error()
                },
            )
            // act
            const promise = sut.execute(createUserParams)
            // assert
            expect(promise).rejects.toThrow()
        })
        it('should throw if PasswordHasherAdapter throws', () => {
            // arrange
            jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(
                new Error(),
            )
            // act
            const promise = sut.execute(createUserParams)
            // assert
            expect(promise).rejects.toThrow()
        })
        // se meu repository lançar uma excessão, eu não quero que ela seja tratada dentro do meu service, mas sim, lançada para cima (para o nosso controller)
        it('should throw if CreateUserRepository throws', () => {
            // arrange
            jest.spyOn(createUserRepository, 'execute').mockRejectedValueOnce(
                new Error(),
            )
            // act
            const promise = sut.execute(createUserParams)
            // assert
            expect(promise).rejects.toThrow()
        })
    })
    describe('success', () => {
        it('should create a user successfully', async () => {
            // act
            const response = await sut.execute(createUserParams)
            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual(createUserServiceResponse)
        })
    })
    describe('validations', () => {
        it('should call CreateUserRepository with correct params', async () => {
            // arrange
            const executeSpy = jest.spyOn(createUserRepository, 'execute')
            // act
            await sut.execute(createUserParams)
            // assert
            expect(executeSpy).toHaveBeenCalledWith(
                createUserRepositoryResponse,
            )
            expect(executeSpy).toHaveBeenCalledTimes(1)
        })
        it('should call idGeneratorAdapter to generate a random uuid', async () => {
            // arrange
            // neste caso, não precisamos mocar nada, apenas falar para ele espiar o idGeneratorAdapter
            const idGeneratorAdapterSpy = jest.spyOn(
                idGeneratorAdapter,
                'execute',
            )
            // para que a gente verifique se esse "id" foi retornado passado para o repository, temos que espiar a classe "CreateUserRepository"
            const createUserRepositorySpy = jest.spyOn(
                createUserRepository,
                'execute',
            )
            // act
            await sut.execute(createUserParams)
            // assert
            // validando se o idGeneratorAdapter foi chamado
            expect(idGeneratorAdapterSpy).toHaveBeenCalled()
            expect(idGeneratorAdapterSpy).toHaveBeenCalledTimes(1)
            // validando se o createUserRepository foi chamado contendo o Id gerado pelo idGeneratorAdapter
            expect(createUserRepositorySpy).toHaveBeenCalledWith({
                ...createUserParams,
                id: createUserServiceResponse.id,
                password: createUserRepositoryResponse.password,
            })
            expect(createUserRepositorySpy).toHaveBeenCalledTimes(1)
        })
        it('should call passwordHasherAdapter to hash the password', async () => {
            // arrange
            const passwordHasherAdapterSpy = jest.spyOn(
                passwordHasherAdapter,
                'execute',
            )
            const createUserRepositorySpy = jest.spyOn(
                createUserRepository,
                'execute',
            )
            // act
            await sut.execute(createUserParams)
            // assert
            // validando se o passwordHasherAdapter foi chamado
            expect(passwordHasherAdapterSpy).toHaveBeenCalled()
            expect(passwordHasherAdapterSpy).toHaveBeenCalledTimes(1)
            // validando se o createUserRepository foi chamado contendo o Id gerado pelo passwordHasherAdapter
            expect(createUserRepositorySpy).toHaveBeenCalledWith({
                ...createUserParams,
                id: createUserServiceResponse.id,
                password: createUserRepositoryResponse.password,
            })
            expect(createUserRepositorySpy).toHaveBeenCalledTimes(1)
        })
    })
})
//# sourceMappingURL=create-user.test.js.map
