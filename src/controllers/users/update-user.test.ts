import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user'
import { UpdateUserParams, UserRepositoryResponse } from '@/shared'

describe('UpdateUserController', () => {
    class UpdateUserServiceStub {
        async execute(
            userId: string,
            params: UpdateUserParams,
        ): Promise<UserRepositoryResponse> {
            return Promise.resolve({
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 6 }),
            })
        }
    }

    const makeSut = () => {
        const updateUserService = new UpdateUserServiceStub()
        const sut = new UpdateUserController(updateUserService)

        return {
            updateUserService,
            sut,
        }
    }

    const httpRequest = {
        params: {
          userId: faker.string.uuid(),
        },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 6,
            }),
        },
    }

    it('should return 200 when updating a user successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(httpRequest)

        // asset
        expect(result.statusCode).toBe(200)
    })
})
