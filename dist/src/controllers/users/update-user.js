import { EmailAlreadyExistsError, UpdateUserFailedError, UserNotFoundError } from '@/errors/user';
import { checkIfIdIsValid, invalidIdResponse, userBadRequestResponse, userNotFoundResponse, } from '../_helpers/index';
import { serverError, ok, badRequest } from '@/shared';
import { ZodError } from 'zod';
import { updateUserSchema } from '@/schemas';
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
            const params = httpRequest.body;
            await updateUserSchema.parseAsync(params);
            const updatedUser = await this.updateUserService.execute(userId, params);
            // após chamar o service, já retornamos o status code, porque caso, dê algo errado no service ou no repositpry, eles vão instanciar um Error, e isso fará com que caia no catch
            return ok(updatedUser);
        }
        catch (error) {
            if (error instanceof ZodError) {
                return badRequest(error.issues[0].message);
            }
            if (error instanceof EmailAlreadyExistsError) {
                return badRequest(error.message);
            }
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse(error.message);
            }
            if (error instanceof UpdateUserFailedError) {
                return serverError(error.message);
            }
            console.error(error);
            return serverError();
        }
    }
}
//# sourceMappingURL=update-user.js.map