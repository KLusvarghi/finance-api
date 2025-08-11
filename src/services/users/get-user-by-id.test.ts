import { UserPublicResponse, UserRepositoryResponse } from '@/shared/types'
import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '@/errors/user'
import { GetUserByIdService } from './get-user-by-id'

describe('GetUserByIdService', () => {
    let sut: GetUserByIdService
    let getUserByIdRepository: GetUserByIdRepositoryStub
    let validUserRepositoryResponse: UserRepositoryResponse
    let validUserServiceResponse: UserPublicResponse
    let validUserId: string

    class GetUserByIdRepositoryStub {
        async execute(_id: string): Promise<UserRepositoryResponse | null> {
            return Promise.resolve(validUserRepositoryResponse)
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserByIdService(getUserByIdRepository)

        return {
            sut,
            getUserByIdRepository,
        }
    }

    beforeEach(() => {
        const {
            sut: service,
            getUserByIdRepository: getUserByIdRepositoryStub,
        } = makeSut()

        sut = service
        getUserByIdRepository = getUserByIdRepositoryStub

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
        it('should return UserNotFoundError if GetUserByIdRepository returns null', async () => {
            // arrange
            jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
                null,
            )

            // act
            const promise = sut.execute(validUserId)

            // assert
            expect(promise).rejects.toThrow(new UserNotFoundError(validUserId))
        })

        // esse tipo de teste é importnate para garantir que o nosso service não está tratando a excessão do nosso repository e passando para cima para o nosso controller
        it('should throw if GetUserByIdRepository throws', async () => {
            // arrange
            jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
                new UserNotFoundError(validUserId),
            )

            // act
            const promise = sut.execute(validUserId)

            // assert
            expect(promise).rejects.toThrow()
        })
    })

    describe('success', () => {
        it('should successefully get an user by id', async () => {
            // act
            const response = await sut.execute(validUserId)

            // assert
            expect(response).toBeTruthy()
            expect(response).toEqual(validUserServiceResponse)
        })
    })

    describe('validations', () => {
        //  validando se o getUserByIdRepository foi chamado com o id correto
        it('should call GetUserByIdRepository with correct params', async () => {
            // arrange
            const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

            // act
            await sut.execute(validUserId)

            // assert
            expect(executeSpy).toHaveBeenCalledWith(validUserId)
            expect(executeSpy).toHaveBeenCalledTimes(1)
        })
    })
})
