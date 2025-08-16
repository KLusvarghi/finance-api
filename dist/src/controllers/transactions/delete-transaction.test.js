import { DeleteTransactionController } from './delete-transaction';
import { TransactionNotFoundError } from '@/errors/user';
import { invalidUUID, transactionId, deleteTransactionControllerResponse, deleteTransactionHttpRequest as baseHttpRequest, } from '@/test';
describe('DeleteTransactionController', () => {
    let sut;
    let deleteTransactionService;
    class DeleteTransactionServiceStub {
        execute(_transactionId) {
            return Promise.resolve(deleteTransactionControllerResponse);
        }
    }
    const makeSut = () => {
        const deleteTransactionService = new DeleteTransactionServiceStub();
        const sut = new DeleteTransactionController(deleteTransactionService);
        return { deleteTransactionService, sut };
    };
    beforeEach(() => {
        const { sut: controller, deleteTransactionService: service } = makeSut();
        sut = controller;
        deleteTransactionService = service;
    });
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    describe('error handling', () => {
        it('should return 500 if DeleteTransactionService throws an error', async () => {
            // arrange
            jest.spyOn(deleteTransactionService, 'execute').mockRejectedValueOnce(new Error());
            // act
            const response = await sut.execute(baseHttpRequest);
            // assert
            expect(response.statusCode).toBe(500);
            expect(response.body?.status).toBe('error');
        });
        it('should return 404 if DeleteTransactionService throws TransactionNotFoundError', async () => {
            // arrange
            // sempre usamos o "mockRejectedValueOnce" quando queremos testar um erro específico, porque ele irá dar um throw
            jest.spyOn(deleteTransactionService, 'execute').mockRejectedValueOnce(new TransactionNotFoundError(transactionId));
            // act
            const response = await sut.execute(baseHttpRequest);
            // assert
            expect(response.statusCode).toBe(404);
            expect(response.body?.status).toBe('error');
            expect(response.body?.message).toBe('Transaction not found.');
        });
    });
    describe('validations', () => {
        it.each(invalidUUID)('should return 400 if transactionId is $description', async ({ id }) => {
            // arrange
            const response = await sut.execute({
                params: {
                    transactionId: id,
                },
            });
            // assert
            expect(response.statusCode).toBe(400);
            expect(response.body?.status).toBe('error');
            expect(response.body?.message).toBe('The provider id is not valid.');
        });
    });
    describe('success cases', () => {
        it('should return 200 when deleting transaction successfully', async () => {
            // act
            const response = await sut.execute(baseHttpRequest);
            // assert
            expect(response.statusCode).toBe(200);
            expect(response.body?.status).toBe('success');
            expect(response.body?.message).toBe('Transaction deleted successfully');
            expect(response.body?.data).toEqual(deleteTransactionControllerResponse);
        });
        it('should call DeleteTransactionService with correct parameters', async () => {
            // arrange
            const executeSpy = jest.spyOn(deleteTransactionService, 'execute');
            // act
            await sut.execute(baseHttpRequest);
            // assert
            expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.params.transactionId);
            expect(executeSpy).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=delete-transaction.test.js.map