---
id: 2025-09-09-implement-factories-on-e2e-tests
titulo: 'Refatorar Testes E2E de Transações para Usar Factories'
tipo: refactor
execucao_automatica: false
---

## 1) Contexto & Motivação

Atualmente, os testes E2E em `src/routes/transactions.e2e.test.ts` criam dados de pré-requisito (como usuários) através de chamadas de API diretas (`request(app).post(...)`). Esta abordagem torna os testes mais lentos, frágeis e menos focados, pois testam a criação de usuários como um efeito colateral em vez de focar exclusivamente na lógica de transações.

O arquivo `src/routes/users.e2e.test.ts` já foi refatorado para usar factories, estabelecendo um padrão claro a ser seguido, conforme definido na `RULE @testing.mdc`.

## 2) Objetivo (Outcome)

Refatorar `src/routes/transactions.e2e.test.ts` para utilizar factories para a criação de dados de setup (usuários e transações), isolando os testes em suas respectivas responsabilidades, melhorando a legibilidade e a velocidade de execução.

## 3) Plano Passo a Passo

- [ ] **Criar uma nova factory `make-transaction`**:
    - Criar o arquivo `src/test/factories/make-transaction.ts`.
    - Esta factory deve ser responsável por criar um usuário (reaproveitando a factory `makeUser` ou criando um via Prisma) e, em seguida, criar uma transação associada a ele.
    - A factory deve retornar o usuário, seus tokens de autenticação e a transação criada, para que possam ser usados no setup dos testes.

- [ ] **Refatorar `GET /api/transactions/me`**:
    - Substituir a criação manual do usuário e da transação por uma chamada à nova factory `make-transaction`.
    - Usar os dados retornados pela factory (tokens e ID da transação) para realizar a requisição e as asserções.

- [ ] **Refatorar `PATCH /api/transactions/me/:transactionId`**:
    - Utilizar a factory `make-transaction` para criar o usuário e a transação que serão atualizados.
    - O teste de falha (404) deve criar apenas um usuário com `makeUser` e tentar atualizar uma transação com um ID inexistente.

- [ ] **Refatorar `DELETE /api/transactions/me/:transactionId`**:
    - Utilizar a factory `make-transaction` para criar o usuário e a transação que serão deletados.
    - O teste de falha (404) deve criar apenas um usuário com `makeUser` e tentar deletar uma transação com um ID inexistente.

- [ ] **Manter `POST /api/transactions` sem factory para criação da transação**:
    - Conforme a `RULE @testing.mdc`, a rota de criação não deve usar uma factory para o recurso principal que está sendo testado.
    - A criação do _usuário_ de pré-requisito **deve** ser feita com `makeUser`.
    - O teste deve continuar a chamar `request(app).post('/api/transactions/me')` para validar o fluxo de criação de ponta a ponta.

## 4) Arquivos-alvo & Globs

- `src/routes/transactions.e2e.test.ts` (arquivo a ser modificado)
- `src/test/factories/make-transaction.ts` (arquivo a ser criado)

## 5) Exemplos de Referência

- `src/routes/users.e2e.test.ts`: Exemplo de como os testes E2E devem parecer após a refatoração, utilizando factories (`makeUser`, `makeUserBalance`) para setup.
- `src/test/factories/make-user.ts`: Exemplo de uma factory existente.

## 6) Critérios de Aceite

- [ ] A factory `make-transaction.ts` foi criada e está funcional.
- [ ] Os testes em `src/routes/transactions.e2e.test.ts` (exceto o de criação) usam a nova factory para setup.
- [ ] A lógica de criação de usuário via API foi removida dos testes de `GET`, `PATCH` e `DELETE`.
- [ ] O teste `POST /api/transactions` continua validando o endpoint de criação diretamente, mas usa `makeUser` para o setup do usuário.
- [ ] Todos os testes continuam passando com sucesso (`pnpm test`).

## 7) Plano de Testes

- A execução da suíte de testes E2E (`pnpm test src/routes/transactions.e2e.test.ts`) é suficiente para validar as alterações.

## 8) Execution Hints

- `pnpm test`

## 9) Rollback & Pós-verificação

- Reverter as alterações no arquivo `src/routes/transactions.e2e.test.ts` e excluir `src/test/factories/make-transaction.ts`.
- Rodar `pnpm test` para garantir que o estado anterior está funcional.
