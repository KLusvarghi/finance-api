// nesses testes, apenas validamos se o que o factory retorna é uma instância válida
// não testamos se o que o controller faz é realmente o que deveria fazer
// isso é responsabilidade do teste de integração

import { makeCreateTransactionController } from './transactions'

import { CreateTransactionController } from '@/controllers'

describe('Transaction Controller Factories', () => {
    describe('createTransaction', () => {
        it('should return a valid CreateTransactionController instance', () => {
            expect(makeCreateTransactionController()).toBeInstanceOf(
                CreateTransactionController,
            )
        })
    })
})
