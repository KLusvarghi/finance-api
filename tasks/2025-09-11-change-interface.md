---
id: 2025-09-11-change-interface
titulo: Refatorar tipos aninhados para interfaces dedicadas
tipo: refactor
execucao_automatica: true
---

## 1) Contexto & Motivação

Atualmente, o código utiliza tipos de interseção anônimos em várias partes da aplicação (ex: `UserPublicResponse & { tokens: TokensGeneratorAdapterResponse }`). Essa abordagem, embora funcional, diminui a legibilidade e a manutenibilidade do código, tornando-o mais verboso e difícil de rastrear. A criação de tipos e interfaces dedicados para essas estruturas melhorará a clareza, a reutilização e a experiência de desenvolvimento.

## 2) Objetivo (Outcome)

O objetivo desta task é substituir os tipos de interseção anônimos por interfaces ou tipos nomeados e dedicados em toda a base de código, resultando em um código mais limpo, claro e fácil de manter.

## 3) Prechecks

Antes de iniciar as alterações, é importante localizar todas as ocorrências dos padrões a serem refatorados. Isso pode ser feito com os seguintes comandos `grep`:

- `grep -r "UserPublicResponse & {" src`
- `grep -r "CreateUserParams & {" src`
- `grep -r "CreateTransactionServiceParams & {" src`
- `grep -r "UserRepositoryResponse & {" src`

## 4) Plano Passo a Passo

A refatoração será dividida em quatro partes principais, cada uma focada em um tipo de interseção específico.

### Parte 1: Criar `UserWithTokensResponse`

1.  **Em `src/shared/types.ts`**:
    - Crie um novo tipo `export type UserWithTokensResponse = UserPublicResponse & { tokens: TokensGeneratorAdapterResponse }`.
    - Importe `TokensGeneratorAdapterResponse` se necessário.
2.  **Em `src/services/users/create-user.ts`**:
    - Atualize a assinatura da classe e do método `execute` para usar `UserWithTokensResponse` em vez do tipo de interseção.
    - Ajuste as importações para remover `UserPublicResponse` e `TokensGeneratorAdapterResponse` se não forem mais usados diretamente, e importe `UserWithTokensResponse`.
3.  **Em `src/controllers/users/create-user.ts`**:
    - Atualize a implementação do `BodyController` e a assinatura do método `execute` para usar `UserWithTokensResponse`.
    - Ajuste as importações.
4.  **Em `src/test/factories/make-user.ts`**:
    - Atualize o tipo de retorno da função `makeUser` para `Promise<UserWithTokensResponse>`.
    - Ajuste as importações.
5.  **Em `src/test/factories/make-transaction.ts`**:
    - Atualize a interface `MakeTransactionResponse` para que a propriedade `user` seja do tipo `UserWithTokensResponse`.
    - Ajuste as importações.

### Parte 2: Criar `CreateUserRepositoryParams`

1.  **Em `src/shared/types.ts`**:
    - Crie um novo tipo `export type CreateUserRepositoryParams = CreateUserParams & { id: string; password: string }`.
    - Na interface `CreateUserRepository`, altere o parâmetro do método `execute` para `user: CreateUserRepositoryParams`.
2.  **Em `src/repositories/postgres/users/create-user.ts`**:
    - Atualize a assinatura do método `execute` para usar `CreateUserRepositoryParams`.
    - Ajuste as importações.

### Parte 3: Criar `CreateTransactionRepositoryParams`

1.  **Em `src/shared/types.ts`**:
    - Crie um novo tipo `export type CreateTransactionRepositoryParams = CreateTransactionServiceParams & { id: string }`.
    - Na interface `CreateTransactionRepository`, altere o parâmetro do método `execute` para `params: CreateTransactionRepositoryParams`.
2.  **Em `src/repositories/postgres/transactions/create-transaction.ts`**:
    - Atualize a assinatura do método `execute` para usar `CreateTransactionRepositoryParams`.
    - Ajuste as importações.

### Parte 4: Criar `AuthenticatedUserResponse`

1.  **Em `src/shared/types.ts`**:
    - Crie um novo tipo `export type AuthenticatedUserResponse = UserRepositoryResponse & { tokens: TokensGeneratorAdapterResponse }`.
    - Na interface `AuthenticateUserService`, altere o tipo de retorno do método `execute` para `Promise<AuthenticatedUserResponse>`.
2.  **Em `src/services/auth/authenticate-user.ts`**:
    - Atualize a assinatura do método `execute` para retornar `Promise<AuthenticatedUserResponse>`.
    - Ajuste as importações.

## 5) Arquivos-alvo & Globs

- `src/shared/types.ts`
- `src/services/users/create-user.ts`
- `src/controllers/users/create-user.ts`
- `src/test/factories/make-user.ts`
- `src/test/factories/make-transaction.ts`
- `src/repositories/postgres/users/create-user.ts`
- `src/repositories/postgres/transactions/create-transaction.ts`
- `src/services/auth/authenticate-user.ts`

## 6) Critérios de Aceite (testáveis)

- [ ] Todos os tipos de interseção anônimos mencionados no plano foram substituídos pelos novos tipos/interfaces dedicados.
- [ ] O código compila sem erros de TypeScript.
- [ ] Todos os testes existentes continuam passando (`pnpm test`).
- [ ] O código está em conformidade com as regras de lint e formatação (`pnpm eslint:check` e `pnpm prettier:check`).
- [ ] Nenhum tipo `any` foi introduzido no código.

## 7) Plano de Testes

- Nenhum novo teste é necessário, pois esta é uma refatoração de tipagem. A suíte de testes existente deve ser suficiente para garantir que nenhuma regressão foi introduzida.

## 8) Execution Hints

- Execute `pnpm test` após as alterações para garantir que nada foi quebrado.
- Execute `pnpm eslint:check` e `pnpm prettier:check` para garantir a qualidade do código.

## 9) Riscos & Impacto

- O risco é baixo, pois esta é uma refatoração de tipagem que não deve alterar a lógica de negócios. O principal risco é a introdução de erros de compilação se a refatoração não for aplicada consistentemente em todos os arquivos relevantes.

## 10) Notas

- Preste atenção especial às importações de tipos para garantir que os novos tipos sejam importados corretamente e os antigos sejam removidos se não forem mais necessários.
