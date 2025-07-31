import { EmailAlreadyExistsError } from '@/errors/user';
import { checkIfEmailIsValid, checkIfIdIsValid, checkIfPasswordIsValid, emailIsAlreadyInUseResponse, invalidIdResponse, invalidPasswordResponse, userBadRequestResponse, } from '../_helpers/index';
import { serverError, ok, badRequest } from '@/shared';
export class UpdateUserController {
    updateUserService;
    constructor(updateUserService) {
        this.updateUserService = updateUserService;
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;
            if (!userId)
                return userBadRequestResponse();
            const isIdValid = checkIfIdIsValid(userId);
            if (!isIdValid)
                return invalidIdResponse();
            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ];
            const params = httpRequest.body;
            // 1. validar se algum campo não permitido foi passado
            const someFielsNotAllowed = Object.keys(params).some((fiels) => !allowedFields.includes(fiels));
            if (someFielsNotAllowed) {
                return badRequest('Some provided field is not allowed.');
            }
            // 2. se receber password, validar o tamanho da string
            if (params.password) {
                const passwordIsValid = checkIfPasswordIsValid(params.password);
                if (!passwordIsValid) {
                    return invalidPasswordResponse();
                }
            }
            if (params.email) {
                const emailIsValid = checkIfEmailIsValid(params.email);
                if (!emailIsValid) {
                    return emailIsAlreadyInUseResponse();
                }
            }
            const updatedUser = await this.updateUserService.execute(userId, params);
            // após chamar o service, já retornamos o status code, porque caso, dê algo errado no service ou no repositpry, eles vão instanciar um Error, e isso fará com que caia no catch
            return ok(updatedUser);
        }
        catch (error) {
            if (error instanceof EmailAlreadyExistsError) {
                return badRequest(error.message);
            }
            console.error(error);
            return serverError();
        }
    }
}
