---
id: 2025-09-16-refactor-controller-tests
titulo: 'Refatorar Testes de Controller para o Padrão `jest-mock-extended`'
tipo: refactor
execucao_automatica: true
---

## 1. Contexto & Motivação

Atualmente, nossos testes de controller (`src/controllers/**/*.test.ts`) utilizam um padrão de stubs manuais (`class ...Stub`) para mockar dependências. Essa abordagem se mostrou frágil e de difícil manutenção, causando erros de tipagem quando as classes de serviço originais são refatoradas.

O objetivo desta task é migrar **todos os testes de controller** para o novo padrão de mocking, que utiliza a biblioteca `jest-mock-extended`. Este padrão oferece segurança de tipos máxima, reduz código boilerplate e torna os testes mais robustos e resilientes a mudanças no código-fonte.

A nova abordagem está documentada na nossa regra de testes: `.cursor/rules/testing.mdc`.

## 2. Objetivo (Outcome)

Todos os testes unitários dentro de `src/controllers/` devem ser refatorados para usar `jest-mock-extended` para mock de dependências injetadas, eliminando completamente o uso de stubs manuais. Os testes devem continuar passando e validando os mesmos cenários de sucesso e de erro.

## 3. Plano de Execução

Para cada arquivo de teste listado na seção "Arquivos-Alvo", execute os seguintes passos:

- [ ] **Passo 1: Instalar Dependência (se não existir)**
    - Verifique no `package.json` se `jest-mock-extended` já é uma dependência de desenvolvimento. Se não for, instale-a com `pnpm add -D jest-mock-extended`.

- [ ] **Passo 2: Remover o Stub Manual**
    - Exclua a declaração da classe `...Stub` (ex: `CreateUserServiceStub`, `GetUserBalanceServiceStub`).
    - Remova a função `makeSut()` que instaciava o stub e o controller.

- [ ] **Passo 3: Atualizar Imports e Configuração do `beforeEach`**
    - Adicione o import: `import { mock, MockProxy } from 'jest-mock-extended'`.
    - No bloco `describe`, declare a variável do mock com o tipo `MockProxy` (ex: `let deleteUserService: MockProxy<DeleteUserService>`).
    - Dentro do `beforeEach`, instancie o mock usando `deleteUserService = mock<DeleteUserService>()` e injete-o diretamente no construtor do controller (`sut = new DeleteUserController(deleteUserService)`).

- [ ] **Passo 4: Adaptar os Testes**
    - Substitua todas as chamadas `jest.spyOn(serviceStub, 'execute')` pela sintaxe direta do mock (ex: `deleteUserService.execute.mockResolvedValue(...)` ou `deleteUserService.execute.mockRejectedValue(...)`).
    - Para testes de erro, valide que o controller **lança a exceção** (`rejects.toThrow()`) em vez de retornar um status HTTP, conforme o padrão estabelecido.

- [ ] **Passo 5: Validar**
    - Execute o arquivo de teste modificado individualmente (`pnpm test src/controllers/.../arquivo.test.ts`) para garantir que todos os testes continuam passando.
    - Execute os linters (`pnpm eslint:check` e `pnpm prettier:check`) para garantir a consistência do código. **É proibido introduzir o tipo `any`**.

## 4. Arquivos-Alvo

- `src/controllers/auth/authenticate-user.test.ts`
- `src/controllers/auth/refresh-token.test.ts`
- `src/controllers/transactions/create-transaction.test.ts`
- `src/controllers/transactions/delete-transaction.test.ts`
- `src/controllers/transactions/get-transactions-by-user-id.test.ts`
- `src/controllers/transactions/update-transaction.test.ts`
- `src/controllers/users/create-user.test.ts`
- `src/controllers/users/get-user-balance.test.ts`
- `src/controllers/users/get-user-by-id.test.ts`
- `src/controllers/users/update-user.test.ts`

## 5. Exemplo de Referência (Padrão Ouro)

O arquivo `src/controllers/users/delete-user.test.ts` **JÁ FOI REFATORADO** e deve ser usado como o guia definitivo para a implementação em todos os outros arquivos.

## 6. Critérios de Aceite

- [ ] Todas as classes `...Stub` manuais foram removidas dos arquivos-alvo.
- [ ] Todos os arquivos de teste alvo agora utilizam `jest-mock-extended` para mockar suas dependências de serviço.
- [ ] O tipo `MockProxy` é usado para garantir a segurança de tipos dos mocks.
- [ ] A suíte de testes completa passa com sucesso (`pnpm test`).
- [ ] O código passa no linter (`pnpm eslint:check`).
- [ ] O código está formatado corretamente (`pnpm prettier:check`).
- [ ] Nenhum teste foi removido; todos os cenários de teste originais continuam sendo cobertos.
