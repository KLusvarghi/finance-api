import { CreateUserController } from './create-user'

interface User {
    first_name: string
    last_name: string
    email: string
    password: string
}

describe('Create User Controller', () => {
    // STUB
    // para que o teste passe, a classe CreateUserController precisa de um Stub, e o Stub é como se fosse uma classe de mentira que retornará o que a gente definir para ele
    // E um Stub, como nesse caso, irá simular uma classe do nosso service "CreateUserService", ele precisa simular essa classe, sendo o brigado a ter todos os métodos que essa classe tem
    class CreateUserServiceStub {
        // na classe real, temos que analisar atentamente os params, no nosso caso, o nosso controle chama o nosso service e passa os params, que não os dados do user:
        // const createdUser = await this.createUserService.execute(params)
        // e é o mesmo que temos que fazer
        execute(user: User) {
            return Promise.resolve({
                id: 'any-id',
                ...user,
            })
        }
    }

    it('should return 201 when creating a new user successfully', async () => {
        // arrange
        const createUserService = new CreateUserServiceStub()
        const createUserController = new CreateUserController(createUserService)
        // como o test precisa criar um user, eu passo para o httpRequest todos os campos que é necessário para criar um user
        const httpRequest = {
            // todos os parametros serão testados quando passar pelo "createUserController", então elas tem que seguir as regras
            body: {
                first_name: 'Kauã',
                last_name: 'Kauã',
                email: 'kaua@gmail.com',
                password: '12345678',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(201)
        // esperamso que o body exista
        expect(result.body).toBeTruthy()
        // podemos ser bem expecífico no que esperamos
        expect(result.body?.data?.first_name).toBe('Kauã')
        // quando queremos esperar que algo não seja, usamos o "not"
        expect(result.body).not.toBeUndefined()
        expect(result.body).not.toBeNull()
        // comparando dois objetos = usar toEqual
        expect(result.body).toEqual(httpRequest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        // arrange
        const createUserService = new CreateUserServiceStub()
        const createUserController = new CreateUserController(createUserService)
        const httpRequest = {
            body: {
                last_name: 'lusvarghi',
                email: 'kaua@gmail.com',
                password: '12345678',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
        expect(result.body?.message).toBe('First name is required')
    })

    it('should return 400 if last_name is not provided', async () => {
        // arrange
        const createUserService = new CreateUserServiceStub()
        const createUserController = new CreateUserController(createUserService)
        const httpRequest = {
            body: {
                first_name: 'kaua',
                email: 'kaua@gmail.com',
                password: '12345678',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
        expect(result.body?.message).toBe('Last name is required')
    })

    it('should return 400 if Email is not provided', async () => {
        // arrange
        const createUserService = new CreateUserServiceStub()
        const createUserController = new CreateUserController(createUserService)
        const httpRequest = {
            body: {
                first_name: 'kaua',
                last_name: 'lusvarghi',
                password: '12345678',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
        expect(result.body?.message).toBe('Email is required')
    })

    it('should return 400 if Email is not valid', async () => {
        // arrange
        const createUserService = new CreateUserServiceStub()
        const createUserController = new CreateUserController(createUserService)
        const httpRequest = {
            body: {
                first_name: 'kaua',
                last_name: 'lusvarghi',
                email: 'das',
                password: '12345678',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
        expect(result.body?.message).toBe('Please provide a valid email')
    })

    it('should return 400 if Password is not provided', async () => {
        // arrange
        const createUserService = new CreateUserServiceStub()
        const createUserController = new CreateUserController(createUserService)
        const httpRequest = {
            body: {
                first_name: 'kaua',
                last_name: 'lusvarghi',
                email: 'kaua@gmail.com',
            },
        }

        // act
        const result = await createUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
        expect(result.body?.message).toBe('Password is required')
    })
    
    it('should return 400 if Password is lass than 6 characters', async () => {
      // arrange
      const createUserService = new CreateUserServiceStub()
      const createUserController = new CreateUserController(createUserService)
      const httpRequest = {
          body: {
              first_name: 'kaua',
              last_name: 'lusvarghi',
              email: 'kaua@gmail.com',
              password: '123',
          },
      }

      // act
      const result = await createUserController.execute(httpRequest)

      // assert
      expect(result.statusCode).toBe(400)
      expect(result.body?.message).toBe('Password must have at least 6 characters')
  })

  it('should call CreateUserService with correct params', async () =>{
    // arrange
    const createUserService = new CreateUserServiceStub()
    const createUserController = new CreateUserController(createUserService)
    const httpRequest = {
        body: {
            first_name: 'kaua',
            last_name: 'lusvarghi',
            email: 'kaua@gmail.com',
            password: '123',
        },
    }

    const executeSpy = jest.spyOn(createUserService, 'execute')

    // act
    const result = await createUserController.execute(httpRequest)

    // assert
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    expect(executeSpy).toHaveBeenCalledTimes(1)

  })
  
})
