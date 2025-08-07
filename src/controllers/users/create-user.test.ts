import { EmailAlreadyExistsError } from '@/errors/user'
import { CreateUserController } from './create-user'
import { faker } from '@faker-js/faker'
import { CreateUserParams, UserPublicResponse } from '@/shared'

describe('CreateUserController', () => {
  class CreateUserServiceStub {
    async execute(params: CreateUserParams) {
      return params
    }
  }

  const makeSut = () => {
    const createUserService = new CreateUserServiceStub()
    const sut = new CreateUserController(createUserService)
    return { createUserService, sut }
  }

  const httpRequest = {
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 }),
    },
  }

  describe('validations', () => {
    describe('first_name', () => {
      it('should return 400 if first_name is not provided', async () => {
        const { sut } = makeSut()
        const result = await sut.execute({ body: { ...httpRequest.body, first_name: undefined } })
        expect(result.statusCode).toBe(400)
        expect(result.body?.status).toBe('error')
        expect(result.body?.message).toBeTruthy()
      })

      it('should return 400 if first_name is too short', async () => {
        const { sut } = makeSut()
        const result = await sut.execute({ body: { ...httpRequest.body, first_name: 'A' } })
        expect(result.statusCode).toBe(400)
      })
    })

    describe('last_name', () => {
      it('should return 400 if last_name is not provided', async () => {
        const { sut } = makeSut()
        const result = await sut.execute({ body: { ...httpRequest.body, last_name: undefined } })
        expect(result.statusCode).toBe(400)
      })
    })

    describe('email', () => {
      it('should return 400 if email is not provided', async () => {
        const { sut } = makeSut()
        const result = await sut.execute({ body: { ...httpRequest.body, email: undefined } })
        expect(result.statusCode).toBe(400)
      })

      it('should return 400 if email is invalid', async () => {
        const { sut } = makeSut()
        const result = await sut.execute({ body: { ...httpRequest.body, email: 'invalid' } })
        expect(result.statusCode).toBe(400)
      })
    })

    describe('password', () => {
      it('should return 400 if password is not provided', async () => {
        const { sut } = makeSut()
        const result = await sut.execute({ body: { ...httpRequest.body, password: undefined } })
        expect(result.statusCode).toBe(400)
      })

      it('should return 400 if password is less than 6 characters', async () => {
        const { sut } = makeSut()
        const result = await sut.execute({ body: { ...httpRequest.body, password: faker.internet.password({ length: 5 }) } })
        expect(result.statusCode).toBe(400)
      })
    })
  })

  describe('success cases', () => {
    it('should create a new user successfully and return 201', async () => {
      const { sut } = makeSut()
      const result = await sut.execute(httpRequest)
      expect(result.statusCode).toBe(201)
      expect(result.body?.status).toBe('success')
      expect(result.body?.data).toMatchObject(httpRequest.body)
    })

    it('should call CreateUserService with correct parameters', async () => {
      const { sut, createUserService } = makeSut()
      const spy = jest.spyOn(createUserService, 'execute')
      await sut.execute(httpRequest)
      expect(spy).toHaveBeenCalledWith(httpRequest.body)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('error handling', () => {
    it('should return 500 if CreateUserService throws generic error', async () => {
      const { sut, createUserService } = makeSut()
      jest.spyOn(createUserService, 'execute').mockRejectedValueOnce(new Error())
      const result = await sut.execute(httpRequest)
      expect(result.statusCode).toBe(500)
      expect(result.body?.status).toBe('error')
    })

    it('should return 400 if CreateUserService throws EmailAlreadyExistsError', async () => {
      const { sut, createUserService } = makeSut()
      jest.spyOn(createUserService, 'execute').mockRejectedValueOnce(
        new EmailAlreadyExistsError(httpRequest.body.email)
      )
      const result = await sut.execute(httpRequest)
      expect(result.statusCode).toBe(400)
      expect(result.body?.message).toContain(httpRequest.body.email)
    })
  })
})
