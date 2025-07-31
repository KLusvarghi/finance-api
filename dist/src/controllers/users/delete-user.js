import { checkIfIdIsValid, invalidIdResponse, userBadRequestResponse, userNotFoundResponse, } from '../_helpers/index';
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
            if (!deletedUser)
                return userNotFoundResponse();
            return ok(deletedUser);
        }
        catch (error) {
            console.error(error);
            return serverError();
        }
    }
}
