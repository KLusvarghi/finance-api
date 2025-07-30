export const makeGetUserByIdController(){
  const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getUserByIdService = new GetUserByIdService(getUserByIdRepository)

    const getUserByIdController = new GetUserByIdController(getUserByIdService)

    return getUserByIdController
}
