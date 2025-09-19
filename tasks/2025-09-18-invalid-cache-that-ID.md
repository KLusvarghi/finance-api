---
id: 2025-09-18-centralize-cache-invalidation-logic
titulo: Centralizar Lógica de Invalidação de Cache de Transações em um Adapter
tipo: refactor
---

### 1. Contexto e Objetivo

Atualmente, a lógica para invalidar o cache de transações de um usuário (`invalidateUserTransactionsCache`) está duplicada em múltiplos controllers (`CreateTransactionController`, `UpdateTransactionController`, `DeleteTransactionController`). Essa repetição viola o princípio DRY (Don't Repeat Yourself), dificulta a manutenção e acopla os controllers à implementação específica do cache (Redis).

O objetivo é refatorar essa lógica para um `TransactionCacheManager` centralizado, que será injetado nos controllers. Isso irá desacoplar os componentes, eliminar a duplicação de código e melhorar a testabilidade da aplicação, permitindo que o gerenciador de cache seja facilmente mockado nos testes unitários dos controllers.

### 2. Plano de Execução

- [ ] **Criar o Adapter de Cache:**
    - [ ] Criar o arquivo `src/adapters/transaction-cache-manager.ts`.
    - [ ] Nele, definir a interface `ITransactionCacheManager` com um método `invalidate(userId: string): Promise<void>`.
    - [ ] Criar a classe `RedisTransactionCacheManager` que implementa `ITransactionCacheManager`.
    - [ ] Mover a lógica de `cache.del('transactions:user:${userId}:*')` para dentro do método `invalidate`.
    - [ ] Exportar a interface e a classe, e também adicioná-los ao `src/adapters/index.ts`.

- [ ] **Testar o Novo Adapter:**
    - [ ] Criar o arquivo de teste `src/adapters/transaction-cache-manager.test.ts`.
    - [ ] Escrever um teste unitário para `RedisTransactionCacheManager`, mockando o `cache` (de `src/config/redis.ts`) para garantir que o método `del` é chamado com o padrão de chave correto.

- [ ] **Refatorar os Controllers:**
    - [ ] Modificar o construtor de `CreateTransactionController`, `UpdateTransactionController` e `DeleteTransactionController` para receber uma instância de `ITransactionCacheManager` via injeção de dependência.
    - [ ] Em cada um desses controllers, substituir a chamada ao método privado `this.invalidateUserTransactionsCache(userId)` pela chamada `this.transactionCacheManager.invalidate(userId)`.
    - [ ] Remover o método privado `invalidateUserTransactionsCache` de todos os controllers.

- [ ] **Atualizar as Factories:**
    - [ ] Analisar o arquivo `src/factories/controllers/transactions.ts` (ou similar).
    - [ ] Modificar a instanciação dos controllers de transação para criar e injetar uma instância de `RedisTransactionCacheManager`.

- [ ] **Atualizar os Testes dos Controllers:**
    - [ ] Modificar os arquivos `*.test.ts` para os controllers de transação (`create-transaction.test.ts`, `update-transaction.test.ts`, `delete-transaction.test.ts`).
    - [ ] Criar um mock do `ITransactionCacheManager` e injetá-lo na construção dos controllers dentro dos testes.
    - [ ] Garantir que os testes existentes continuam passando e, se necessário, adicionar asserções para verificar se `transactionCacheManager.invalidate` é chamado.

### 3. Arquivos-Alvo

- `tasks/2025-09-18-invalid-cache-that-ID.md` (este arquivo)
- `src/adapters/index.ts`
- `src/adapters/transaction-cache-manager.ts` (novo)
- `src/adapters/transaction-cache-manager.test.ts` (novo)
- `src/controllers/transactions/create-transaction.ts`
- `src/controllers/transactions/update-transaction.ts`
- `src/controllers/transactions/delete-transaction.ts`
- `src/controllers/transactions/create-transaction.test.ts`
- `src/controllers/transactions/update-transaction.test.ts`
- `src/controllers/transactions/delete-transaction.test.ts`
- `src/factories/controllers/transactions.ts` (a ser verificado e modificado)

### 4. Critérios de Aceite

- [ ] A lógica de invalidação de cache foi removida dos controllers e existe apenas no `RedisTransactionCacheManager`.
- [ ] O `RedisTransactionCacheManager` possui um teste unitário que valida seu comportamento.
- [ ] Os controllers de transação recebem `ITransactionCacheManager` via injeção de dependência.
- [ ] As factories de controller foram atualizadas para injetar a nova dependência.
- [ ] Os testes unitários dos controllers foram atualizados com o mock do gerenciador de cache e todos passam.
- [ ] Todos os testes da aplicação passam (`pnpm test`).
- [ ] O código passa no linter (`pnpm eslint:check`).
- [ ] O código está formatado corretamente (`pnpm prettier:check`).
- [ ] O tipo `any` não foi introduzido em nenhum lugar do código.
