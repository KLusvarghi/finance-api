import { checkIfIdIsValid, invalidIdResponse, userBadRequestResponse, userNotFoundResponse, } from '../_helpers/index';
import { UserNotFoundError } from '@/errors/user';
import { serverError, ok } from '@/shared';
export class DeleteUserController {
    deletedUserService;
    constructor(deletedUserService) {
        this.deletedUserService = deletedUserService;
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;
            if (!userId) {
                return userBadRequestResponse();
            }
            const isIdValid = checkIfIdIsValid(userId);
            if (!isIdValid)
                return invalidIdResponse();
            const deletedUser = await this.deletedUserService.execute(userId);
            return ok(deletedUser);
        }
        catch (error) {
            console.error(error);
            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse();
            }
            return serverError();
        }
    }
}
//# sourceMappingURL=delete-user.js.map