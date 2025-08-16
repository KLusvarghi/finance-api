import { EmailAlreadyExistsError } from '@/errors/user';
import { createUserSchema } from '@/schemas';
import { serverError, badRequest, created } from '@/shared';
import { ZodError } from 'zod';
export class CreateUserController {
    createUserService;
    constructor(createUserService) {
        this.createUserService = createUserService;
    }
    async execute(httpRequest) {
        try {
            // validar a requisição (campos obrigatório, email e tamenho de senha)
            const params = httpRequest.body;
            // validando o schema de forma asyncrona
            await createUserSchema.parseAsync(params);
            // rxecutamos nossa regra de negocio
            const createdUser = await this.createUserService.execute(params);
            // retornar a resposta para o user (status code)
            return created(createdUser);
        }
        catch (error) {
            if (error instanceof ZodError) {
                return badRequest(error.issues[0].message);
            }
            if (error instanceof EmailAlreadyExistsError) {
                return badRequest(error.message);
            }
            console.error(error);
            return serverError();
        }
    }
}
//# sourceMappingURL=create-user.js.map