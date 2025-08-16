import { badRequest, created, serverError } from '../_helpers';
import { createTransactionSchema } from '@/schemas';
import { ZodError } from 'zod';
export class CreateTransactionController {
    createTransactionService;
    constructor(createTransactionService) {
        this.createTransactionService = createTransactionService;
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body;
            // usando o "safeParseAsync" é uma forma de tratar os erros de forma mais segura e eveitar que de um throw e caia no catch e consigamos tratar o erro aqui ainda
            // await createTransactionSchema.safeParseAsync(params)
            await createTransactionSchema.parseAsync(params);
            const createdTransaction = await this.createTransactionService.execute(params);
            return created(createdTransaction);
        }
        catch (error) {
            if (error instanceof ZodError) {
                return badRequest(error.issues[0].message);
            }
            console.error(error);
            return serverError();
        }
    }
}
//# sourceMappingURL=create-transaction.js.map