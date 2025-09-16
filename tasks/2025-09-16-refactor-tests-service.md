---
id: 2025-09-16-refactor-service-tests
titulo: 'Refatorar Testes de Service para o Padrão `jest-mock-extended`'
tipo: refactor
execucao_automatica: true
---

## 1. Contexto & Motivação

Seguindo a modernização de nossos padrões de teste, esta task foca em refatorar a camada de `services`. Atualmente, os testes de serviço (`src/services/**/*.test.ts`) também utilizam stubs manuais, que são frágeis e de difícil manutenção.

O objetivo é migrar **todos os testes de serviço** para o padrão `jest-mock-extended`, alinhando-os com a refatoração já planejada para os controllers. Isso garantirá que nossos testes de lógica de negócio sejam totalmente isolados, seguros e resilientes a futuras alterações nas camadas de repositório e adaptadores.

A abordagem está documentada na regra de testes: `.cursor/rules/testing.mdc`.

## 2. Objetivo (Outcome)

Todos os testes unitários dentro de `src/services/` devem ser refatorados para usar `jest-mock-extended` para mock de dependências (Repositories, Adapters), eliminando completamente o uso de stubs manuais. Os testes devem continuar validando os mesmos cenários de lógica de negócio.

## 3. Plano de Execução

Para cada arquivo de teste listado na seção "Arquivos-Alvo", execute os seguintes passos:

- [ ] **Passo 1: Remover o Stub Manual**
    - Exclua as declarações de classes `...Stub` (ex: `CreateUserRepositoryStub`, `PasswordHasherStub`).
    - Remova a função `makeSut()` que instaciava os stubs e o serviço.

- [ ] **Passo 2: Atualizar Imports e Configuração do `beforeEach`**
    - Adicione o import: `import { mock, MockProxy } from 'jest-mock-extended'`.
    - No bloco `describe`, declare as variáveis dos mocks com o tipo `MockProxy` (ex: `let createUserRepo: MockProxy<CreateUserRepository>`).
    - Dentro do `beforeEach`, instancie os mocks usando `createUserRepo = mock<CreateUserRepository>()` e injete-os diretamente no construtor do serviço em teste (`sut = new CreateUserService(createUserRepo, ...)`).

- [ ] **Passo 3: Adaptar os Testes**
    - Substitua todas as chamadas `jest.spyOn(stub, 'execute')` pela sintaxe direta do mock (ex: `createUserRepo.execute.mockResolvedValue(...)`).
    - Garanta que a lógica de `arrange, act, assert` permaneça focada em testar a lógica de negócio do serviço, com as dependências devidamente mockadas.

- [ ] **Passo 4: Validar**
    - Execute o arquivo de teste modificado individualmente para garantir que todos os testes continuam passando.
    - Execute os linters (`pnpm eslint:check` e `pnpm prettier:check`). **É proibido introduzir o tipo `any`**.

## 4. Arquivos-Alvo

- `src/services/auth/authenticate-user.test.ts`
- `src/services/auth/refresh-token.test.ts`
- `src/services/transactions/create-transaction.test.ts`
- `src/services/transactions/delete-transaction.test.ts`
- `src/services/transactions/get-transactions-by-user-id.test.ts`
- `src/services/transactions/update-transaction.test.ts`
- `src/services/users/create-user.test.ts`
- `src/services/users/delete-user.test.ts`
- `src/services/users/get-user-balance.test.ts`
- `src/services/users/get-user-by-id.test.ts`
- `src/services/users/update-user.test.ts`

## 5. Exemplo de Referência (Padrão Ouro)

O arquivo `src/controllers/users/delete-user.test.ts` serve como referência para a **MECÂNICA** de uso do `jest-mock-extended`. A lógica deve ser aplicada para mockar as dependências de cada serviço (ex: mockar `UserRepository` dentro de `UserService.test.ts`).

## 6. Critérios de Aceite

- [ ] Todas as classes `...Stub` manuais foram removidas dos arquivos de teste de serviço.
- [ ] Todos os arquivos de teste alvo agora utilizam `jest-mock-extended` para mockar suas dependências.
- [ ] O tipo `MockProxy` é usado para garantir a segurança de tipos dos mocks.
- [ ] A suíte de testes completa passa com sucesso (`pnpm test`).
- [ ] O código passa no linter (`pnpm eslint:check`) e no prettier (`pnpm prettier:check`).
- [ ] Nenhum teste foi removido; todos os cenários de lógica de negócio continuam cobertos.
