// nesses testes, apenas validamos se o que o factory retorna é uma instância válida
// não testamos se o que o controller faz é realmente o que deveria fazer
// isso é responsabilidade do teste de integração
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
} from './transactions'
import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionsByUserIdController,
    UpdateTransactionController,
} from '@/controllers'
describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })
    it('should return a valid GetTransactionsByUserIdController instance', () => {
        expect(makeGetTransactionsByUserIdController()).toBeInstanceOf(
            GetTransactionsByUserIdController,
        )
    })
    it('should return a valid UpdateTransactionController instance', () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        )
    })
    it('should return a valid DeleteTransactionController instance', () => {
        expect(makeDeleteTransactionController()).toBeInstanceOf(
            DeleteTransactionController,
        )
    })
})
//# sourceMappingURL=transaction.test.js.map
