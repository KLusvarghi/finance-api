import { EmailAlreadyExistsError } from '@/errors/user'
import { CreateUserController } from './create-user'
import { faker } from '@faker-js/faker'

interface User {
    first_name: string
    last_name: string
    email: string
    password: string
}

describe('CreateUserController', () => {
    // STUB
    // para que o teste passe, a classe CreateUserController precisa de um Stub, e o Stub é como se fosse uma classe de mentira que retornará o que a gente definir para ele
    // E um Stub, como nesse caso, irá simular uma classe do nosso service "CreateUserService", ele precisa simular essa classe, sendo o brigado a ter todos os métodos que essa classe tem
    class CreateUserServiceStub {
        // na classe real, temos que analisar atentamente os params, no nosso caso, o nosso controle chama o nosso service e passa os params, que não os dados do user:
        // const createdUser = await this.createUserService.execute(params)
        // e é o mesmo que temos que fazer
        execute(user: User) {
            return Promise.resolve({
                id: faker.string.uuid(),
                ...user,
            })
        }
    }

    // SUT = Suite Under Test
    // É de boa prática a gente sempre nomear com SUT oque nos estamos testando
    const makeSut = () => {
        const createUserService = new CreateUserServiceStub()
        // como o que queremos testar é o controller, então podemos nomear ele como "sut" afim de ficar mais claro do que estamos testando
        const sut = new CreateUserController(createUserService)

        return {
            createUserService,
            sut,
        }
    }

    // E ao criar essa const aqui foram criamso elas como "caso de sucesso", onde ela passará no teste, e para os testes que a gente não tem algum campo afim de testar, nós apenas passamos o campo como "undefined"

    // como o test precisa criar um user, eu passo para o httpRequest todos os campos que é necessário para criar um user
    const httpRequest = {
        // todos os parametros serão testados quando passar pelo "createUserController", então elas tem que seguir as regras
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 6,
            }),
        },
    }

    it('should return 201 when creating a new user successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)

        // esperamso que o body exista
        expect(result.body).toBeTruthy()

        // podemos ser bem expecífico no que esperamos
        // expect(result.body?.data?.first_name).toBe('Kauã')

        // quando queremos esperar que algo não seja, usamos o "not"
        expect(result.body).not.toBeUndefined()
        expect(result.body).not.toBeNull()

        // comparando dois objetos = usar toEqual
        // expect(result.body).toEqual(httpRequest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                first_name: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                last_name: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if Email is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                last_name: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if Email is not valid', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if Password is not provided', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: undefined,
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if Password is lass than 6 characters', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: faker.internet.password({ length: 5 }),
            },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserService with correct params', async () => {
        // arrange
        const { sut, createUserService } = makeSut()
        const executeSpy = jest.spyOn(createUserService, 'execute')

        // act
        await sut.execute(httpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
        expect(executeSpy).toHaveBeenCalledTimes(1)
    })

    // Vamos testar caso o nosso CreateUserService lançar uma execessão pra gente

    // caso o repository lance um erro, isso gerara um erro para o service e o serivce para o controller, até o momento não tratamos e cairá no controller e gerar um erro da nossa classe "serverError" e quermos testar isso
    it('should return 500 if CreateUserService throws', async () => {
        // arrange
        const { sut, createUserService } = makeSut()

        // E para simular esse throw no service, podemos criar outros Stub que gere um erro, ou podemos usar "mocks"

        // iremos monitorar novamente meu método "execute" do nosso service e usaremos o método "mockRejectedValueOnce" que irá mockar / fakear um valor uma vez, e colocamos o que queremos fakear, podendo passar o valor direto ou dentro de uma arrow function. No nosso caso queremos mokar um erro
        // assim, quando mockamos, estamos sobrescrevendo o que esse método faz apenas um vez
        // jest.spyOn(createUserService, 'execute').mockRejectedValueOnce(new Error())
        jest.spyOn(createUserService, 'execute').mockRejectedValueOnce(() => {
            new Error()
        })

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(500)
    })

    // no teste abaixo, a gente não testa de fato, criando um user com um email e testando se o email já existe poruqe isso não é responsabilidade do controller, e sim do service, e apenas testamos o que há no controller, que é o tratamento do erro

    it('should return 500 if CreateUserService throws EmailAlreadyExistsError', async () => {
        // arrange
        const { sut, createUserService } = makeSut()

        jest.spyOn(createUserService, 'execute').mockRejectedValueOnce(
            new EmailAlreadyExistsError(httpRequest.body.email),
        )
        // jest.spyOn(createUserService, 'execute').mockImplementationOnce(() =>
        //     Promise.reject(
        //     new EmailAlreadyExistsError(httpRequest.body.email))
        // )

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
        expect(result.body?.message).toBe(
            `The e-mail ${httpRequest.body.email} is already in use.`,
        )
    })
})
